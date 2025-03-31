const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // lastMessage: {
    //     type: String, // Optional: Stores the last message for quick display
    // },
    // updatedAt: {
    //     type: Date,
    //     default: Date.now
    // }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
