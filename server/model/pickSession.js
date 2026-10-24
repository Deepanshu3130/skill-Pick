const mongoose = require('mongoose');

const pickSessionSchema = new mongoose.Schema(
    {
        searchId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        userId: {
            type: String,
            required: true,
            index: true
        },
        type: {
            type: String,
            enum: ['course', 'repo'],
            default: 'course'
        },
        query: {
            type: String,
            required: true
        },
        topicSlug: {
            type: String,
            required: true
        },
        results: [
            {
                index: Number,
                title: String,
                url: String,
                domain: String,
                snippet: String,
                // GitHub specific fields
                fullName: String,
                description: String,
                stars: Number,
                language: String,
                ownerAvatar: String
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 600 // 10 minutes TTL
        }
    }
);

module.exports = mongoose.model('PickSession', pickSessionSchema);
