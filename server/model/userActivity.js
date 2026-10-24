const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['submission', 'github-search'],
        required: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    expireAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 }
    }
});

module.exports = mongoose.model('UserActivity', userActivitySchema);
