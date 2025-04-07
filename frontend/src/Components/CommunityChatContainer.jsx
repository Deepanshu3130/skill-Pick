import React, { useEffect, useState , useRef} from 'react';
import { useCommunityChatStore } from '../store/useCommunityChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import { useAuth } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { formatMessageTime } from "../lib/utility";
import { useChatStore } from '../store/useChatStore';
import MessageSkeleton from './skeletons/MessageSkeleton';


function CommunityChatContainer({setIsCommunityChat}) {
  const { 
    communityMessages, 
    selectedCommunity,
    setSelectedCommunity,
    isCommunityMessagesLoading, 
    getCommunityMessages, 
    subscribeToCommunityMessages, 
    unsubscribeFromCommunityMessages 
  } = useCommunityChatStore();
  

  const{sendMessage, setSelctedUser} = useChatStore()

  const { getToken } = useAuth();
  const { user } = useUser();
  const messageEndRef = useRef("");

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedCommunity) return;
      const token = await getToken(); // Get fresh Clerk token
      getCommunityMessages(selectedCommunity._id, token);
      subscribeToCommunityMessages();
    };
    fetchMessages();

    return () => unsubscribeFromCommunityMessages();
  }, [selectedCommunity._id,getCommunityMessages,subscribeToCommunityMessages,unsubscribeFromCommunityMessages]);

    useEffect(() => {
          if (messageEndRef.current && communityMessages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, [communityMessages]);

  const [activeProfile, setActiveProfile] = useState(null);

  const toggleProfile = (messageId) => {
    setActiveProfile(prev => (prev === messageId ? null : messageId));
  };
  

  
  const handleSendHii = async(receiverId) => {
   console.log("Receiver ID:", receiverId); // Log the receiverId
    setSelctedUser(receiverId);
    setSelectedCommunity(null); 
    try {
      const token = await getToken();
     await sendMessage("Hii", null, token);
     setIsCommunityChat(false) // Send "Hii" message
    }
    catch (error) {
      console.error("Error sending message:", error);
    }
  };


  if (isCommunityMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

 
    return (
      <div className='flex-1 flex flex-col overflow-auto h-full'>
        <ChatHeader />
  
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
          {communityMessages.map((message) => {
            const isSenderMe = message.senderClerkId === user.id;
            return (
              <div 
                key={message._id} 
                className={`flex items-start ${isSenderMe ? 'justify-end' : 'justify-start'}`}
                ref={messageEndRef}
              >
                {!isSenderMe && (
                  <div className='relative flex-shrink-0'>
                    <img
                      src={message.senderId.profilePicture || "/avatar.png"}
                      alt='profile pic'
                      className='size-10 rounded-full border cursor-pointer'
                      onClick={() => toggleProfile(message._id)}
                    />
                    {activeProfile === message._id && (
                      <div className='absolute top-12 left-0 bg-white p-3 rounded-md shadow-md border z-10 w-48'>
                        <p className='font-semibold text-sm'>
                          {message.senderId.firstName + " " + message.senderId.lastName || "Unknown User"}
                        </p>
                        <button
                          className='mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600'
                          onClick={() => handleSendHii(message.senderId)}
                        >
                          Send Hii 👋
                        </button>
                      </div>
                    )}
                  </div>
                )}
  
                <div className={`flex flex-col ${isSenderMe ? 'items-end' : 'items-start'} ml-2 max-w-[70%]`}>
                  <p className='text-xs text-gray-500 mb-1'>
                    {isSenderMe ? "You" : message.senderId.firstName || "User"} • {formatMessageTime(message.createdAt)}
                  </p>
                  <div 
                    className={`px-4 py-2 rounded-lg break-words whitespace-pre-wrap ${
                      isSenderMe 
                        ? 'bg-primary text-primary-content rounded-tr-none' 
                        : 'bg-base-200 rounded-tl-none'
                    }`}
                    style={{ 
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="max-w-full rounded-md mb-2 max-h-[150px] object-contain"
                      />
                    )}
                    {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
  
        <MessageInput />
      </div>
    );
  }
  
  export default CommunityChatContainer;