import React from "react";
import { X, ArrowLeft } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useCommunityChatStore } from "../store/useCommunityChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelctedUser } = useChatStore();
  const { selectedCommunity, setSelectedCommunity } = useCommunityChatStore();

  const isCommunityChat = !!selectedCommunity;
  const chatTitle = isCommunityChat 
    ? selectedCommunity.channelName 
    : selectedUser 
      ? `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || "User"
      : "Select a chat";

  const chatProfilePic = isCommunityChat 
    ? selectedCommunity.channelImg || "/group-avatar.png" 
    : selectedUser 
      ? selectedUser.profilePicture || "/avatar.png" 
      : "/avatar.png";

  const closeChat = () => {
    if (isCommunityChat) {
      setSelectedCommunity(null);
    } else {
      setSelctedUser(null);
    }
  };

  return (
    <div className="p-3.5 border-b border-base-300 bg-base-100 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        <button
          onClick={closeChat}
          className="btn btn-ghost btn-xs btn-square md:hidden shrink-0"
          aria-label="Back to contacts"
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} />
        </button>

        {/* Avatar */}
        <div className="avatar shrink-0">
          <div className="size-9 rounded-xl bg-base-300 border border-base-300 overflow-hidden">
            <img 
              src={chatProfilePic} 
              alt={chatTitle} 
              onError={(e) => { e.target.src = '/avatar.png'; }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0">
          <h3 className="font-bold text-xs sm:text-sm text-base-content truncate">
            {chatTitle}
          </h3>
          <p className="text-[11px] text-base-content/60 truncate font-mono">
            {isCommunityChat ? "Course Study Room" : "Direct Message"}
          </p>
        </div>
      </div>

      {/* Desktop Close button */}
      <button 
        onClick={closeChat}
        className="btn btn-ghost btn-xs btn-square text-base-content/60 hover:text-base-content hidden sm:inline-flex"
        aria-label="Close chat pane"
      >
        <X className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  );
};

export default ChatHeader;
