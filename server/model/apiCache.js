const mongoose = require('mongoose');

const apiCacheSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        provider: {
            type: String,
            enum: ['brave', 'github'],
            required: true
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        expireAt: {
            type: Date,
            required: true,
            index: { expireAfterSeconds: 0 }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('ApiCache', apiCacheSchema);
