import {create} from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
//import { axiosInstance } from "../lib/axios";
//import { apiConnector } from "../lib/axios";
import { getSocket } from "../App";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,

    getUsers: async(token)=>{
        set({isUserLoading:true});
        try{
            const response = await axios.get(
                // Correct URL with path parameter
               `http://localhost:3000/api/v1/courseData/getUsers`,
                
                // Required request body matching backend expectations
                // {
                //   text: "what ,
                //   image: "" // Add image URL if needed or leave empty
                // },
                
                // Proper headers
                {
                  headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    
                  }
                }
              );
               
            set({users: response.data.Users});
        }catch(error){
           toast.error(error.response.data.message);
        }finally{
            set({isUserLoading:false});
        }
    },

    getMessages:async(userId ,token)=>{
        set({isMessagesLoading:true});
        try{
            const response = await axios.get(
                // Correct URL with path parameter
               `http://localhost:3000/api/v1/courseData/getMessages/${userId}`,
                
                // Required request body matching backend expectations
                // {
                //   text: "what ,
                //   image: "" // Add image URL if needed or leave empty
                // },
                
                // Proper headers
                {
                  headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    
                  }
                }
              );
              console.log(response) ;
            set({messages: response.data.messages}); 
             
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading:false});
        }


    },
    sendMessage: async(text,img,token)=>{
        console.log("call recieved")
        const {selectedUser,messages} = get();
        console.log("selected user",selectedUser);
        try{
            const response = await axios.post(
                // Correct URL with path parameter
               `http://localhost:3000/api/v1/courseData/sendMessage/${selectedUser._id}`,
                {
                    text: text.trim(),
                    image: img,
                    receverClerkId: selectedUser.clerkId,
                },
                
                // Required request body matching backend expectations
                // {
                //   text: "what the fck cutii",
                //   image: "" // Add image URL if needed or leave empty
                // },
                
                // Proper headers
                {
                  headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    
                  }
                }
              );
              console.log(response) ;
              set({messages: [...messages, response.data.newMessage]});
        }catch(error){
            toast.error(error);

        }

    },
    setSelctedUser: (selectedUser) => set({selectedUser}),

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
    
        const socket = getSocket();
    
        socket.on("newMessage", (newMessage) => {
          const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
          if (!isMessageSentFromSelectedUser) return;
    
          set({
            messages: [...get().messages, newMessage],
          });
        });
      },

      unsubscribeFromMessages: () => {
        const socket = getSocket();
        socket.off("newMessage");
      },
    
})); 