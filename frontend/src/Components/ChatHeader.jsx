import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useCommunityChatStore } from "../store/useCommunityChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelctedUser } = useChatStore();
  const { selectedCommunity, setSelectedCommunity } = useCommunityChatStore();


  const isCommunityChat = !!selectedCommunity;
  const chatTitle = isCommunityChat 
    ? selectedCommunity.channelName 
    : selectedUser 
      ? `${selectedUser.firstName} ${selectedUser.lastName}` 
      : "Select a chat";

  const chatProfilePic = isCommunityChat 
    ? selectedCommunity.channelImg || "/community-placeholder.png" 
    : selectedUser 
      ? selectedUser.profilePicture || "/avatar.png" 
      : "/avatar.png";

  // Close chat function
  const closeChat = () => {
    if (isCommunityChat) {
      setSelectedCommunity(null);
    } else {
      setSelctedUser(null);
    }
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={chatProfilePic} alt={chatTitle} />
            </div>
          </div>

          {/* Chat info */}
          <div>
            <h3 className="font-medium">{chatTitle}</h3>
          </div>
        </div>

        {/* Close button */}
        <button onClick={closeChat}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
