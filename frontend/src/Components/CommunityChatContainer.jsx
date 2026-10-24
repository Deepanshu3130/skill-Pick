import React, { useEffect, useState, useRef } from 'react';
import { useCommunityChatStore } from '../store/useCommunityChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import { useAuth, useUser } from "@clerk/clerk-react";
import { formatMessageTime } from "../lib/utility";
import { useChatStore } from '../store/useChatStore';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { Send, User } from 'lucide-react';

function CommunityChatContainer({ setIsCommunityChat }) {
  const { 
    communityMessages, 
    selectedCommunity,
    setSelectedCommunity,
    isCommunityMessagesLoading, 
    getCommunityMessages, 
    subscribeToCommunityMessages, 
    unsubscribeFromCommunityMessages 
  } = useCommunityChatStore();

  const { sendMessage, setSelctedUser } = useChatStore();
  const { getToken } = useAuth();
  const { user } = useUser();
  const messageEndRef = useRef(null);

  const [activeProfile, setActiveProfile] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedCommunity) return;
      const token = await getToken();
      getCommunityMessages(selectedCommunity._id, token);
      subscribeToCommunityMessages();
    };
    fetchMessages();

    return () => unsubscribeFromCommunityMessages();
  }, [selectedCommunity?._id, getCommunityMessages, subscribeToCommunityMessages, unsubscribeFromCommunityMessages]);

  useEffect(() => {
    if (messageEndRef.current && communityMessages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [communityMessages]);

  const toggleProfile = (messageId) => {
    setActiveProfile(prev => (prev === messageId ? null : messageId));
  };

  const handleSendHii = async (receiverUser) => {
    setSelctedUser(receiverUser);
    setSelectedCommunity(null);
    try {
      const token = await getToken();
      await sendMessage("Hi!", null, token);
      if (setIsCommunityChat) {
        setIsCommunityChat(false);
      }
    } catch (error) {
      console.error("Error sending DM:", error);
    }
  };

  if (isCommunityMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-100">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full bg-base-100">
      <ChatHeader />

      {/* Message Feed using daisyUI chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {(!communityMessages || communityMessages.length === 0) ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
            <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center text-primary">
              <User className="size-5" />
            </div>
            <h4 className="font-bold text-sm text-base-content">Welcome to {selectedCommunity?.channelName}!</h4>
            <p className="text-xs text-base-content/60 max-w-sm">
              Be the first to post a doubt, share a project, or say hello to peers studying this course.
            </p>
          </div>
        ) : (
          communityMessages.map((message) => {
            const isSenderMe = message.senderClerkId === user?.id;
            const senderName = isSenderMe 
              ? "You" 
              : `${message.senderId?.firstName || 'User'} ${message.senderId?.lastName || ''}`.trim();
            const avatarUrl = isSenderMe 
              ? (user?.imageUrl || "/avatar.png") 
              : (message.senderId?.profilePicture || "/avatar.png");

            return (
              <div 
                key={message._id}
                className={`chat ${isSenderMe ? "chat-end" : "chat-start"}`}
              >
                {/* Avatar with DM Popup */}
                <div className="chat-image avatar relative">
                  <div 
                    className="size-8 sm:size-9 rounded-full bg-base-300 border border-base-300 cursor-pointer overflow-hidden"
                    onClick={() => !isSenderMe && toggleProfile(message._id)}
                    title={!isSenderMe ? "Click to view profile / send DM" : undefined}
                  >
                    <img
                      src={avatarUrl}
                      alt={senderName}
                      onError={(e) => { e.target.src = '/avatar.png'; }}
                    />
                  </div>

                  {/* Profile Popup */}
                  {activeProfile === message._id && !isSenderMe && (
                    <div className="absolute top-10 left-0 bg-base-100 p-3 rounded-xl shadow-xl border border-base-300 z-50 w-52 space-y-2">
                      <div className="text-xs font-semibold text-base-content truncate">
                        {senderName}
                      </div>
                      <button
                        className="btn btn-xs btn-primary w-full gap-1 font-semibold"
                        onClick={() => handleSendHii(message.senderId)}
                      >
                        <Send className="size-3" />
                        <span>Send Direct Message</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Header (Sender name + timestamp) */}
                <div className="chat-header text-[11px] opacity-60 mb-1 flex items-center gap-1.5 font-mono">
                  <span>{senderName}</span>
                  <time>{formatMessageTime(message.createdAt)}</time>
                </div>

                {/* Bubble */}
                <div 
                  className={`chat-bubble text-xs sm:text-sm leading-relaxed break-words whitespace-pre-wrap max-w-xs md:max-w-md ${
                    isSenderMe 
                      ? "chat-bubble-primary font-medium" 
                      : "bg-base-200 text-base-content border border-base-300"
                  }`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="max-w-full rounded-lg mb-2 max-h-48 object-contain"
                    />
                  )}
                  {message.text && <div>{message.text}</div>}
                </div>
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
}

export default CommunityChatContainer;
