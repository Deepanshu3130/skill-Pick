const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        aliases: [
            {
                type: String,
                trim: true,
                lowercase: true
            }
        ],
        parent: {
            type: String,
            default: null,
            trim: true,
            lowercase: true
        },
        related: [
            {
                type: String,
                trim: true,
                lowercase: true
            }
        ],
        searchCount: {
            type: Number,
            default: 0
        },
        lastFetchedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Topic', topicSchema);
