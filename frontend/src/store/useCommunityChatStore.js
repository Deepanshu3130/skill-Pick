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
            set({ joinedCommunity: response.data.channels });
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
            
            const socket = getSocket();
            if (socket) {
                const targetRoom = selectedCommunity.roomId || selectedCommunity._id;
                socket.emit("sendCommunityMessage", {
                    communityId: targetRoom,
                    message: response.data.data.newMessage 
                });
            }
    
            return response.data.data.newMessage;
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
    
        socket.on("newCommunityMessage", (newMessage) => {
            set(state => {
                const messageExists = state.communityMessages.some(
                    msg => msg._id === newMessage._id
                );
                
                const matchesChannel = 
                    newMessage.channelId === selectedCommunity._id || 
                    newMessage.channelId === selectedCommunity.roomId ||
                    newMessage.communityId === primaryRoom;

                if (!messageExists && matchesChannel) {
                    return {
                        communityMessages: [...state.communityMessages, newMessage]
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
