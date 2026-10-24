const mongoose = require('mongoose');

const detailsSchema = new mongoose.Schema(
    {
        platform: {
            type: String,
            required: true
        },
        provider: {
            type: String,
            required: false
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        imageUrl: {
            type: String
        },
        duration: {
            type: String
        },
        lectures: {
            type: String
        },
        link: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ["course", "repo"],
            default: "course"
        },
        pricingType: {
            type: String,
            default: "free"
        },
        kind: {
            type: String,
            enum: ["playlist", "video", null],
            default: null
        },
        source: {
            type: String,
            enum: ["youtube-api", "github-api", "search", "search-picked", "manual"],
            default: "youtube-api"
        },
        channelOrOwner: {
            type: String,
            trim: true
        },
        url: {
            type: String,
            trim: true
        },
        thumbnail: {
            type: String,
            trim: true
        },
        externalId: {
            type: String,
            required: true
        },
        topics: [
            {
                type: String,
                trim: true,
                lowercase: true
            }
        ],
        meta: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        status: {
            type: String,
            enum: ["approved", "pending", "rejected"],
            default: "approved"
        },
        addedBy: {
            type: String,
            default: null
        },
        upvotes: [
            {
                type: String
            }
        ],
        reports: [
            {
                type: String
            }
        ],
        roomId: {
            type: String,
            default: null
        },
        rating: {
            type: String
        },
        reviews: {
            type: String
        },
        skillPickRating: {
            type: Number
        },
        level: {
            type: String,
            default: "intermediate"
        },
        query: {
            type: String
        }
    },
    { timestamps: true }
);

detailsSchema.index({ type: 1, externalId: 1 }, { unique: true, sparse: true });
detailsSchema.index({ topics: 1, status: 1 });
detailsSchema.index({ status: 1 });

module.exports = mongoose.model('courseDetail', detailsSchema);
