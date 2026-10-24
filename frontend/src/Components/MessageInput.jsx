import React, { useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { useCommunityChatStore } from '../store/useCommunityChatStore';

function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();
  const { sendCommunityMessage, selectedCommunity } = useCommunityChatStore();
  const { getToken } = useAuth();

  const isCommunityChat = !!selectedCommunity;

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      const token = await getToken();
      if (isCommunityChat && selectedCommunity) {
        await sendCommunityMessage(text, imagePreview, token);
      } else if (selectedUser) {
        await sendMessage(text, imagePreview, token);
      }
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-3 sm:p-4 border-t border-base-300 bg-base-100">
      {imagePreview && (
        <div className="mb-2.5 flex items-center gap-2">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-xl border border-base-300"
            />
            <button
              onClick={removeImage}
              className="btn btn-circle btn-xs btn-neutral absolute -top-2 -right-2 size-5 min-h-0"
              type="button"
              aria-label="Remove attached image"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <button
          type="button"
          className={`btn btn-ghost btn-sm btn-square ${
            imagePreview ? "text-primary" : "text-base-content/60 hover:text-base-content"
          }`}
          onClick={() => fileInputRef.current?.click()}
          title="Attach image"
          aria-label="Attach image"
        >
          <Image className="size-4" strokeWidth={1.5} />
        </button>

        <input
          type="text"
          className="input input-sm sm:input-md input-bordered flex-1 rounded-xl text-xs sm:text-sm focus:outline-hidden"
          placeholder={isCommunityChat ? "Ask a doubt or share a resource..." : "Type a direct message..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          type="submit"
          className="btn btn-sm sm:btn-md btn-primary btn-square rounded-xl"
          disabled={!text.trim() && !imagePreview}
          aria-label="Send message"
        >
          <Send className="size-4" strokeWidth={1.5} />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
