const mongoose = require('mongoose');
const channelMessageSchema = new mongoose.Schema({

    senderId:{
       type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    senderClerkId:{
        type: String,
        required:true
    },
    channelId: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: "Channel" },

    text:{
        type:String,
     
    },
    image:{
        type:String,
        default: ''
        
    },
}, {timestamps: true});
module.exports = mongoose.model('ChannelMessage', channelMessageSchema);