import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import { useAuth, useUser } from "@clerk/clerk-react";
import { formatMessageTime } from "../lib/utility";
import MessageSkeleton from './skeletons/MessageSkeleton';
import { User } from 'lucide-react';

function ChatContainer() {
  const { messages, selectedUser, isMessagesLoading, getMessages, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { getToken } = useAuth();
  const messageEndRef = useRef(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchMessage = async () => {
      if (!selectedUser?._id) return;
      const token = await getToken();
      getMessages(selectedUser._id, token);
      subscribeToMessages();
    };
    fetchMessage();

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-100">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const recipientName = `${selectedUser?.firstName || 'User'} ${selectedUser?.lastName || ''}`.trim();

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full bg-base-100">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {(!messages || messages.length === 0) ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
            <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center text-primary">
              <User className="size-5" />
            </div>
            <h4 className="font-bold text-sm text-base-content">Direct Message with {recipientName}</h4>
            <p className="text-xs text-base-content/60 max-w-sm">
              Send a message to introduce yourself, collaborate on a project, or share learning tips.
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isSenderMe = message.senderClerkId === user?.id;
            const avatarUrl = isSenderMe 
              ? (user?.imageUrl || "/avatar.png")
              : (selectedUser?.profilePicture || "/avatar.png");

            return (
              <div
                key={index}
                className={`chat ${isSenderMe ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-image avatar">
                  <div className="size-8 sm:size-9 rounded-full bg-base-300 border border-base-300 overflow-hidden">
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      onError={(e) => { e.target.src = '/avatar.png'; }}
                    />
                  </div>
                </div>

                <div className="chat-header text-[11px] opacity-60 mb-1 font-mono">
                  <time>{formatMessageTime(message.createdAt)}</time>
                </div>

                <div
                  className={`chat-bubble text-xs sm:text-sm leading-relaxed break-words whitespace-pre-wrap max-w-xs md:max-w-md ${
                    isSenderMe
                      ? 'chat-bubble-primary font-medium'
                      : 'bg-base-200 text-base-content border border-base-300'
                  }`}
                >
                  {(message.image || message.message?.image) && (
                    <img
                      src={message.image || message.message?.image}
                      alt="Attachment"
                      className="max-w-full rounded-lg mb-2 max-h-48 object-contain"
                    />
                  )}
                  {(message.text || message.message?.text || message.content) && <div>{message.text || message.message?.text || message.content}</div>}
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

export default ChatContainer;
