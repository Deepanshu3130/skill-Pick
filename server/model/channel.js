const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseDetail",
    required: true,
  },
  roomId: {
    type: String,
    unique: true,
    sparse: true
  },
  channelName: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  channelImg: {
    type: String
  }
}, { timestamps: true });

const Channel = mongoose.model("Channel", channelSchema);

module.exports = Channel;
