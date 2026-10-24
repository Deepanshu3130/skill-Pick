const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const { verifyToken } = require("@clerk/clerk-sdk-node");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});

// Map of userId -> socketId
const userSocketMap = {};

// Map of roomId -> Set of userIds currently in the room
const roomMembers = new Map();

// Helper to get receiver socket ID
function getReceiverSocketId(userId) {
    return userSocketMap[userId] || null;
}

// Canonical room ID generator for in-room DMs
function getDmRoomId(user1, user2) {
    const sorted = [user1.toString(), user2.toString()].sort();
    return `dm:${sorted[0]}:${sorted[1]}`;
}

// 🔐 SOCKET AUTHENTICATION MIDDLEWARE: VERIFY JWT (NEVER TRUST CLIENT-SENT USERID)
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || 
                      socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, '');

        if (!token) {
            console.warn("⚠️ Socket connection rejected: Missing JWT token.");
            return next(new Error("Authentication error: Token is required"));
        }

        // Test token bypass for automated backend test runner
        if (process.env.NODE_ENV !== 'production' && token === 'test_runner_jwt') {
            socket.userId = socket.handshake.auth?.userId || 'test_user_id';
            return next();
        }

        const secretKey = process.env.CLERK_SECRET_KEY;
        const verified = await verifyToken(token, { secretKey });
        
        if (!verified || !verified.sub) {
            console.warn("⚠️ Socket connection rejected: Invalid JWT token claims.");
            return next(new Error("Authentication error: Invalid token"));
        }

        // Securely assign the verified identity
        socket.userId = verified.sub;
        console.log(`🔒 Socket authenticated for verified user: ${socket.userId}`);
        return next();
    } catch (err) {
        console.warn("⚠️ Socket auth verification failed:", err.message);
        return next(new Error("Authentication error: Unauthorized JWT"));
    }
});

io.on("connection", (socket) => {
    const userId = socket.userId;
    console.log("✅ Authenticated socket connected:", socket.id, "User:", userId);

    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Track user's active joined rooms
    const socketRooms = new Set();

    // 1. Join a community resource room (e.g. course:<externalId> or repo:<owner/repo>)
    socket.on("joinCommunity", (roomId) => {
        if (!roomId) {
            console.warn("⚠️ joinCommunity event received without roomId");
            return;
        }

        socket.join(roomId);
        socketRooms.add(roomId);

        if (!roomMembers.has(roomId)) {
            roomMembers.set(roomId, new Set());
        }
        roomMembers.get(roomId).add(userId);

        console.log(`✅ User ${userId} joined room ${roomId}`);
        io.to(roomId).emit("roomMembersUpdated", Array.from(roomMembers.get(roomId)));
    });

    // 2. Broadcast community message inside the room
    socket.on("sendCommunityMessage", (messageData) => {
        if (!messageData?.communityId) {
            console.warn("⚠️ Message missing communityId");
            return;
        }

        const enrichedMessage = {
            ...messageData,
            senderClerkId: userId,
            createdAt: new Date()
        };

        io.to(messageData.communityId).emit("newCommunityMessage", enrichedMessage);
    });

    // 3. In-room Direct Messaging: "dm:<smallerUserId>:<largerUserId>"
    // Only permitted if BOTH users are currently members of the room
    socket.on("joinInRoomDm", ({ roomId, targetUserId }) => {
        if (!roomId || !targetUserId) {
            socket.emit("inRoomDmError", { message: "Room ID and target user ID are required." });
            return;
        }

        const members = roomMembers.get(roomId);
        const isSenderInRoom = members && members.has(userId);
        const isTargetInRoom = members && members.has(targetUserId);

        if (!isSenderInRoom || !isTargetInRoom) {
            socket.emit("inRoomDmError", {
                message: "Direct messages are only permitted between users currently in this room."
            });
            return;
        }

        const dmRoomId = getDmRoomId(userId, targetUserId);
        socket.join(dmRoomId);

        // Also add recipient's socket to the DM room if connected
        const targetSocketId = getReceiverSocketId(targetUserId);
        if (targetSocketId) {
            const targetSocket = io.sockets.sockets.get(targetSocketId);
            if (targetSocket) {
                targetSocket.join(dmRoomId);
            }
        }

        socket.emit("inRoomDmReady", { dmRoomId, roomId, targetUserId });
    });

    socket.on("sendInRoomDm", ({ roomId, recipientId, text, image }) => {
        if (!roomId || !recipientId) return;

        const members = roomMembers.get(roomId);
        const isSenderInRoom = members && members.has(userId);
        const isRecipientInRoom = members && members.has(recipientId);

        if (!isSenderInRoom || !isRecipientInRoom) {
            socket.emit("inRoomDmError", {
                message: "Cannot send DM: both users must be actively in the room."
            });
            return;
        }

        const dmRoomId = getDmRoomId(userId, recipientId);
        const dmMessage = {
            dmRoomId,
            roomId,
            senderId: userId,
            recipientId,
            text,
            image,
            createdAt: new Date()
        };

        io.to(dmRoomId).emit("newInRoomDmMessage", dmMessage);
    });

    // Leave a specific room
    socket.on("leaveCommunity", (roomId) => {
        socket.leave(roomId);
        socketRooms.delete(roomId);
        if (roomMembers.has(roomId)) {
            roomMembers.get(roomId).delete(userId);
            if (roomMembers.get(roomId).size === 0) {
                roomMembers.delete(roomId);
            } else {
                io.to(roomId).emit("roomMembersUpdated", Array.from(roomMembers.get(roomId)));
            }
        }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        console.log("❌ Authenticated user disconnected:", userId);
        delete userSocketMap[userId];

        // Clean up from all rooms
        for (const roomId of socketRooms) {
            if (roomMembers.has(roomId)) {
                roomMembers.get(roomId).delete(userId);
                if (roomMembers.get(roomId).size === 0) {
                    roomMembers.delete(roomId);
                } else {
                    io.to(roomId).emit("roomMembersUpdated", Array.from(roomMembers.get(roomId)));
                }
            }
        }

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { io, server, getReceiverSocketId, getDmRoomId, app };
