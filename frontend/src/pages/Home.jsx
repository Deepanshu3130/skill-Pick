import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import CommunitySidebar from '../Components/CommunitySidebar';
import ChatContainer from '../Components/ChatContainer';
import NoChatSelected from '../Components/NoChatSelected';
import { useChatStore } from '../store/useChatStore';
import { useCommunityChatStore } from '../store/useCommunityChatStore';
import CommunityChatContainer from '../Components/CommunityChatContainer';

const HomePage = () => {
  // State to toggle between User Chat and Community Chat
  const [isCommunityChat, setIsCommunityChat] = useState(true); // Default: Community Chat
  const { selectedUser, setSelctedUser } = useChatStore();
  const { selectedCommunity, setSelectedCommunity } = useCommunityChatStore();

  // Handle Toggle
  const toggleChatType = () => {
    setIsCommunityChat((prev) => !prev);

    // Clear the previous selection when switching
    if (isCommunityChat) {
      setSelectedCommunity(null); // Clear Community Selection
    } else {
      setSelctedUser(null); // Clear User Selection
    }
  };

  return (
    <div className="h-screen bg-base-200 flex flex-col items-center pt-20 px-4">
      {/* Toggle Button */}
      <div className="mb-4">
        <button
          onClick={toggleChatType}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          {isCommunityChat ? 'Switch to User Chat' : 'Switch to Community Chat'}
        </button>
      </div>

      {/* Chat Container */}
      <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)] flex rounded-lg overflow-hidden">
        {/* Sidebar Changes Based on Selection */}
        {isCommunityChat ? <CommunitySidebar /> : <Sidebar />}

        {/* Chat Container */}
        {isCommunityChat ? (
          selectedCommunity ? <CommunityChatContainer setIsCommunityChat ={setIsCommunityChat} /> : <NoChatSelected />
        ) : (
          selectedUser ? <ChatContainer /> : <NoChatSelected />
        )}
      </div>
    </div>
  );
};

export default HomePage;
