import React from 'react'
import { useRef, useState } from "react";
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

function MessageInput() {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();
    const { getToken } = useAuth();

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      };

      
  const handleImageChange = (e) => {
    const file = e.target.files[0];
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
    const token = await getToken();
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
        console.log("sending message")
      await sendMessage(text,imagePreview,token);
      console.log("message sent")

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  
  return (
    <div className='p-4 w-full'>
     {imagePreview &&(
        <div className='mb-3 items-center gap-2'>
            <div className='relative'>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 left-15 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
            </div>
        </div>
     )}

     <form onSubmit={handleSendMessage} className="flex  items-center gap-2">
        <div className="flex-1 flex gap-2">
            <input
            type='text'
            className='w-full input input-bordered rounded-lg input-sm sm:input-md'
             placeholder="Type a message..."
             value={text}
             onChange={(e)=>setText(e.target.value)}
            ></input>
            <input
                type='file'
                className='hidden'
                accept='image/*'
                ref={fileInputRef}
                onChange={handleImageChange}

            />
             <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
          <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
        </div>
     </form>

    </div>
  )
}

export default MessageInput