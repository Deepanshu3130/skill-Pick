import {create} from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
//import { axiosInstance } from "../lib/axios";
//import { apiConnector } from "../lib/axios";
import { getSocket } from "../App";
import { getMessages, getUsers, sendMessage } from "../operations/apiConnectors";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,

    getUsers: async(token)=>{
        set({isUserLoading:true});
        try{
            const response = await getUsers(token)
               
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
            const response = await getMessages(userId ,token)
            set({messages: response.data.messages}); 
             
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading:false});
        }


    },
    sendMessage: async(text,img,token)=>{
        //console.log("call recieved")
        const {selectedUser,messages} = get();
        //console.log("selected user",selectedUser);
        try{
            const response = await sendMessage(text,img,token,selectedUser)
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