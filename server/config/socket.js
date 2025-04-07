const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin:"*", methods: ["GET", "POST"] },
});

const userSocketMap = {};

// Function to get receiver's socket ID
function getReceiverSocketId(userId) {
    return userSocketMap[userId] || null; // Prevents returning undefined
}

io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Send updated online users
    } else {
        console.warn("⚠️ No userId provided in handshake query");
    }

    // Handle user joining a community chat room
    socket.on("joinCommunity", (communityId) => {
        if (communityId) {
            socket.join(communityId);
            console.log(`✅ User ${socket.id} joined community ${communityId}`);
        } else {
            console.warn("⚠️ joinCommunity event received without communityId");
        }
    });

    // Handle sending messages to the community
    socket.on("sendCommunityMessage", (messageData) => {
        console.log("Received community message:", messageData);
        if (!messageData.communityId) {
            console.warn("Message missing communityId");
            return;
        }
        
        // Add timestamp and other metadata
        const enrichedMessage = {
            ...messageData,
            createdAt: new Date(),
            // Add any other required fields
        };
        
        io.to(messageData.communityId).emit("newCommunityMessage", enrichedMessage);
    });

    socket.on("disconnect", () => {
        console.log("❌ A user disconnected:", socket.id);
        if (userId) delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Update online users list
    });
});

// Export modules
module.exports = { io, server, getReceiverSocketId, app };
