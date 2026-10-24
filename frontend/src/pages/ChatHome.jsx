import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import CommunitySidebar from '../Components/CommunitySidebar';
import ChatContainer from '../Components/ChatContainer';
import NoChatSelected from '../Components/NoChatSelected';
import { useChatStore } from '../store/useChatStore';
import { useCommunityChatStore } from '../store/useCommunityChatStore';
import CommunityChatContainer from '../Components/CommunityChatContainer';
import { MessageSquare, Users } from 'lucide-react';

const ChatHome = () => {
  const [isCommunityChat, setIsCommunityChat] = useState(true); // Default: Course Rooms (Community)
  const { selectedUser, setSelctedUser } = useChatStore();
  const { selectedCommunity, setSelectedCommunity } = useCommunityChatStore();

  const toggleChatType = (communityMode) => {
    setIsCommunityChat(communityMode);
    if (communityMode) {
      setSelctedUser(null);
    } else {
      setSelectedCommunity(null);
    }
  };

  const hasActiveChat = isCommunityChat ? !!selectedCommunity : !!selectedUser;

  return (
    <div className="min-h-screen bg-base-200/50 flex flex-col pt-20 pb-8 px-2 sm:px-4">
      <div className="w-full max-w-6xl mx-auto flex flex-col flex-1">
        {/* Top Segmented Switcher */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="join bg-base-100 p-1 rounded-xl border border-base-300 shadow-xs">
            <button
              onClick={() => toggleChatType(true)}
              className={`btn btn-sm join-item gap-2 font-semibold text-xs ${
                isCommunityChat ? 'btn-primary' : 'btn-ghost text-base-content/70'
              }`}
            >
              <MessageSquare className="size-3.5" strokeWidth={1.5} />
              <span>Course Rooms</span>
            </button>
            <button
              onClick={() => toggleChatType(false)}
              className={`btn btn-sm join-item gap-2 font-semibold text-xs ${
                !isCommunityChat ? 'btn-primary' : 'btn-ghost text-base-content/70'
              }`}
            >
              <Users className="size-3.5" strokeWidth={1.5} />
              <span>Direct Messages</span>
            </button>
          </div>

          <div className="text-xs text-base-content/60 hidden sm:block font-mono">
            {isCommunityChat ? "Topic & Course Study Rooms" : "1-on-1 Peer Networking"}
          </div>
        </div>

        {/* Two-Pane Chat Container */}
        <div className="bg-base-100 border border-base-300 shadow-sm w-full flex-1 min-h-[620px] max-h-[calc(100vh-9.5rem)] flex rounded-2xl overflow-hidden">
          {/* Left Sidebar: visible on desktop, or on mobile when no chat is active */}
          <div className={`w-full md:w-72 lg:w-80 shrink-0 border-r border-base-300 flex flex-col ${
            hasActiveChat ? 'hidden md:flex' : 'flex'
          }`}>
            {isCommunityChat ? <CommunitySidebar /> : <Sidebar />}
          </div>

          {/* Right Chat Pane: visible on desktop, or on mobile when chat is active */}
          <div className={`flex-1 flex flex-col min-w-0 bg-base-100 ${
            !hasActiveChat ? 'hidden md:flex' : 'flex'
          }`}>
            {isCommunityChat ? (
              selectedCommunity ? (
                <CommunityChatContainer setIsCommunityChat={setIsCommunityChat} />
              ) : (
                <NoChatSelected />
              )
            ) : (
              selectedUser ? (
                <ChatContainer />
              ) : (
                <NoChatSelected />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHome;
