import React, { useEffect,useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
 import { useAuth } from "@clerk/clerk-react";
 import { useUser } from "@clerk/clerk-react";
import { formatMessageTime } from "../lib/utility"
import MessageSkeleton from './skeletons/MessageSkeleton';

function ChatContainer() {
  const {messages, selectedUser, isMessagesLoading ,getMessages, subscribeToMessages, unsubscribeFromMessages} = useChatStore();
   const { getToken } = useAuth();
   const messageEndRef = useRef(null);
   const { user } = useUser();
   
      //online users
      useEffect(() => {
        const fetchMessage = async () => {
          const token = await getToken(); // Get fresh Clerk token
          getMessages(selectedUser._id,token);
          subscribeToMessages();
        };
        fetchMessage();

        return() => unsubscribeFromMessages()
      },[selectedUser._id,getMessages,subscribeToMessages,unsubscribeFromMessages]);

      useEffect(() => {
        if (messageEndRef.current && messages) {
          messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [messages]);
      
      if (isMessagesLoading) {
        return (
          <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <MessageSkeleton />
            <MessageInput />
          </div>
        );
      }
  return (
    
    <div className='flex-1 flex flex-col overflow-auto '>
       <ChatHeader></ChatHeader>
       <div className='flex-1 overflow-y-auto p-4 space-y-4 '> 
       {messages.map((message,index)=>(
        <div
        key={index}
        className={`chat ${message.senderClerkId === user.id ? "chat-end" : "chat-start"}  `  }
        ref={messageEndRef}>
          <div className='chat-image avatar'>
            <div className='size-10 rounded-full border'>
              <img
               src={message.senderClerkId ===user.id ? user.imageUrl: selectedUser.profilePicture || "/avatar.png"}
               alt='profile pic'
               />
            </div>
          </div>
          <div className="chat-header mb-1  flex col break-words whitespace-pre-wrap ">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className={`chat-bubble break-words whitespace-pre-wrap max-w-xs md:max-w-md lg:max-w-lg ${message.senderClerkId === user.id 
                ? 'bg-primary text-primary-content' 
                : 'bg-base-200 text-base-content'
                 
              }`}>
            
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
       
       </div>
       <MessageInput></MessageInput>

    </div>

  )
}

export default ChatContainer