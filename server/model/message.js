const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId, // Must specify type
        ref: 'Chat', // Reference to Chat model
        required: true
     },
    senderId:{
       type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    senderClerkId:{
        type: String,
        required:true
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiverClerkId:{
        type: String,
        required:true
    },
    text:{
        type:String,
     
    },
    image:{
        type:String,
        default: ''
        
    },
}, {timestamps: true});
module.exports = mongoose.model('Message', messageSchema);