const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // Assuming you have a Course model
    required: true,
  },
  channelName: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
    },
  ],
  channelImg:{
    type:String
  }
}, { timestamps: true });

const Channel = mongoose.model("Channel", channelSchema);

module.exports = Channel;
