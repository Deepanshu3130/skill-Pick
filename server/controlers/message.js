//const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");
const Chat = require('../model/chat');
const Message = require('../model/message');
const User = require('../model/user');
const {io } = require("../config/socket");
//const { getRandomData } = require('random-useragent');
const {getReceiverSocketId} = require("../config/socket");
const { uploadImageToCloudinary } = require('../utils/fileUplods');

exports.getUsers = async (req, res) => {
    try{
        
        const clerkID = req.auth.userId;
       
        if (!clerkID) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // find the actual id;
        const loggedinUser = await User.findOne({ clerkId: clerkID });  
        if (!loggedinUser) {
            return res.status(404).json({ message: "User not found in DB" });
          }
        const chats = await Chat.find({ participants: loggedinUser._id });
      

        const chatUsersIds = chats.flatMap(chat=> chat.participants).filter(Id => !Id.equals(loggedinUser._id));
        
        const chatUsers = await User.find({ _id: { $in: chatUsersIds } });
        
        res.status(200).json({ 
            success: true,
            Users: chatUsers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error",
        error: error.message
         });
      }
    }; 

exports.getMessages = async (req, res) => {
    try{
        const {id:receiverId} = req.params;
        const clerkID = req.auth.userId;

        if (!clerkID) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        // find the actual id;
        const loggedinUser = await User.findOne({ clerkId: clerkID });
        const senderId = loggedinUser._id;
        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        });
        res.status(200).json({ 
            success: true,
            messages
        });
    }catch(error){
        res.status(500).json({ 
            success: false,
            message: "Server error",
            error: error.message,
       });
     }
}

exports.sendMessage = async (req, res) => {
    try{
        const folder = process.env.FOLDER_NAME;
       
      
        const {id:receiverId} = req.params;
        const {receverClerkId} = req.body;
        
        const senderClerkId = req.auth.userId;
       
       
        if (!senderClerkId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // find the actual id;
        const loggedinUser = await User.findOne({ clerkId: senderClerkId });
        const senderId = loggedinUser._id;
        const { text, image } = req.body;
        let chat = await Chat.findOne({
            participants: {
                $all: [senderId, receiverId]
            }
        });
        if (!chat) {
           chat = await Chat.create({
               participants: [senderId, receiverId]
               
           });
        }
        let imageUrl;
       
        if(image){
               
             const uploadResponse = await uploadImageToCloudinary(image, folder);
             imageUrl = uploadResponse.secure_url;
             
            if(!imageUrl){
                return res.status(500).json({ 
                    success: false,
                    message: "Image upload failed",
                });
            } 
        }
           
        // handle the image and cludinary case later on
        const message = new Message({
            chatId: chat._id,
            senderId,
            senderClerkId: senderClerkId,
            receiverClerkId: receverClerkId,
            receiverId,
            text,
            image:imageUrl,
        });
        
        await message.save();
        const receiverSocketId =getReceiverSocketId(receverClerkId);
        console.log(receiverSocketId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage" , message)
        }
       
       
        // to real time fucntionality wtith the help of shocket io
        res.status(200).json({ 
            success: true,
            message: "Message sent successfully",
            newMessage: message
        });
    
    }catch(error){
        res.status(500).json({ 
            success: false,
            message: "Server error",
            error: error.message,
        }); 
    }
}