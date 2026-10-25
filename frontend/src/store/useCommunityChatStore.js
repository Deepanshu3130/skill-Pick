import { create } from "zustand";
import toast from "react-hot-toast";
import { getSocket } from "../App";
import { getCommunityMessages, sendCommunityMessage, getJoinedCommunities } from "../operations/apiConnectors";

export const useCommunityChatStore = create((set, get) => ({
    communityMessages: [],  
    joinedCommunity: [],    
    selectedCommunity: null,
    isCommunityLoading: false, 
    isCommunityMessagesLoading: false, 

    getJoinedCommunities: async (token) => {
        set({ isCommunityLoading: true });
        try {
            const response = await getJoinedCommunities(token);
            const channels = response.data.channels || [];
            channels.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
            set({ joinedCommunity: channels });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch community channels");
        } finally {
            set({ isCommunityLoading: false });
        }
    },

    getCommunityMessages: async (channelId, token) => {
        set({ isCommunityMessagesLoading: true });
        try {
            const response = await getCommunityMessages(channelId, token);
            set({ communityMessages: response.data.messages });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch community messages");
        } finally {
            set({ isCommunityMessagesLoading: false });
        }
    },

    sendCommunityMessage: async (text, image, token) => {
        const { selectedCommunity, communityMessages } = get();
        if (!selectedCommunity) return;
    
        try {
            const response = await sendCommunityMessage(
                text, 
                image, 
                token,
                selectedCommunity 
            );

            const savedMsg = response?.data?.data?.newMessage || response?.data?.newMessage;
            if (savedMsg) {
                set(state => {
                    const exists = state.communityMessages.some(m => m._id && savedMsg._id && m._id === savedMsg._id);
                    if (!exists) {
                        return { communityMessages: [...state.communityMessages, savedMsg] };
                    }
                    return state;
                });
            }
            
            const socket = getSocket();
            if (socket && savedMsg) {
                const targetRoom = selectedCommunity.roomId || selectedCommunity._id;
                socket.emit("sendCommunityMessage", {
                    communityId: targetRoom,
                    message: savedMsg 
                });
            }
    
            return savedMsg;
        } catch (error) {
            console.error("Error sending community message:", error);
            toast.error(error.message);
            throw error;
        }
    },

    setSelectedCommunity: (selectedCommunity) => {
        set({ selectedCommunity });
    },

    subscribeToCommunityMessages: () => {
        const { selectedCommunity } = get();
        if (!selectedCommunity) return;
    
        const socket = getSocket();
        if (!socket) return;

        const primaryRoom = selectedCommunity.roomId || selectedCommunity._id;
        socket.emit("joinCommunity", primaryRoom);
        if (selectedCommunity.roomId && selectedCommunity._id && selectedCommunity._id !== selectedCommunity.roomId) {
            socket.emit("joinCommunity", selectedCommunity._id);
        }
    
        socket.on("newCommunityMessage", (incoming) => {
            if (!incoming) return;
            const inner = incoming.message && typeof incoming.message === 'object' ? incoming.message : null;
            const normalized = {
                ...incoming,
                ...(inner || {}),
                _id: inner?._id || incoming._id,
                text: inner?.text ?? incoming.text ?? "",
                image: inner?.image ?? incoming.image ?? "",
                senderId: inner?.senderId || incoming.senderId,
                senderClerkId: inner?.senderClerkId || incoming.senderClerkId,
                channelId: inner?.channelId || incoming.channelId || incoming.communityId,
                communityId: incoming.communityId || inner?.communityId,
                createdAt: inner?.createdAt || incoming.createdAt || new Date().toISOString()
            };

            set(state => {
                const messageExists = state.communityMessages.some(
                    msg => (msg._id && normalized._id && msg._id === normalized._id) ||
                           (msg.createdAt && normalized.createdAt && msg.createdAt === normalized.createdAt && msg.text === normalized.text)
                );
                
                const matchesChannel = 
                    normalized.channelId === selectedCommunity._id || 
                    normalized.channelId === selectedCommunity.roomId ||
                    normalized.communityId === primaryRoom ||
                    normalized.communityId === selectedCommunity._id ||
                    normalized.communityId === selectedCommunity.roomId;

                if (!messageExists && matchesChannel) {
                    return {
                        communityMessages: [...state.communityMessages, normalized]
                    };  
                }
                return state;
            });
        });
    },

    unsubscribeFromCommunityMessages: () => {
        const socket = getSocket();
        if (socket) {
            socket.off("newCommunityMessage");
        }
    },
}));
