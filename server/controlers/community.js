const Channel = require("../model/channel")
const courseDetail = require("../model/courseDetail")
const User = require("../model/user")
const ChannelMessage = require("../model/channelMessage") 
const {io } = require("../config/socket"); 

const slugify = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-") // Replace special chars with "-"
      .replace(/-+/g, "-") // Remove extra dashes
      .substring(0, 10); // Keep it short
  };
exports.joinChannel = async (req, res) => {
    try {
        console.log("JOIN CHANNEL CALLED")
      const { courseId} = req.body;
      const clerkID = req.auth.userId;
      
      if (!clerkID) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find user in database based on Clerk ID
    const user = await User.findOne({ clerkId: clerkID });
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    const userId = user._id; 
      // Validate request data
      if (!courseId) {
        return res.status(400).json({ success: false, message: "Course ID and User ID are required" });
      }
      
      // Check if course exists
      const course = await courseDetail.findById(courseId);
      if (!course) {
        return res.status(404).json({ success: false, message: "Course not found" });
      }
  
      // Check if channel exists for the course
      let channel = await Channel.findOne({ courseId });
  
      // If channel does not exist, create it
      if (!channel) {
        const shortName = slugify(course.title);
        channel = new Channel({
          courseId,
          channelName: `${shortName}-${courseId.slice(-4)}`, // You can customize this
          users: [userId],
          channelImg: course.imageUrl // Add user to the new channel
        });
  
        await channel.save();
        return res.status(201).json({ success: true, message: "Channel created and user added", channel });
      }
  
      // Check if user is already in the channel
      if (channel.users.includes(userId)) {
        return res.status(400).json({ success: false, message: "User already in the channel" });
      }
  
      // Add user to existing channel
      channel.users.push(userId);
      await channel.save();
  
      return res.status(200).json({ success: true, message: "User added to channel", channel });
  
    } catch (error) {
      console.error("Error in joining channel:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };


  exports.getUserChannels = async (req, res) => {
    try {
        const clerkID = req.auth.userId; // Get user ID from Clerk

        if (!clerkID) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Find user in database based on Clerk ID
        const user = await User.findOne({ clerkId: clerkID });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const userId = user._id; // Get actual MongoDB user ID

        // Find all channels where the user is present
        const userChannels = await Channel.find({ users: userId });

        if (userChannels.length === 0) {
            return res.status(404).json({ success: false, message: "User is not part of any channel" });
        }

        return res.status(200).json({ success: true, channels: userChannels });

    } catch (error) {
        console.error("Error fetching user channels:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


exports.sendMessageToChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { text, image } = req.body;
        const senderClerkId = req.auth.userId;

        const sender = await User.findOne({ clerkId: senderClerkId });
        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }

        const newMessage = new ChannelMessage({
            channelId,
            senderId: sender._id,
            senderClerkId,
            senderProfilePic: sender.profilePic || "/avatar.png",
            text,
            image
        });

        await newMessage.save();

        // Populate the sender data before sending
        const populatedMessage = await ChannelMessage.populate(newMessage, {
            path: 'senderId',
            select: 'firstName lastName'
        });

        io.to(channelId).emit("newCommunityMessage", {
            ...populatedMessage.toObject(), // Convert to plain object
            createdAt: newMessage.createdAt
        });

        return res.status(200).json({
            success: true,
            data: { newMessage: populatedMessage }
        });
    } catch (error) {
        console.error("Controller error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

exports.getMessagesForChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const clerkID = req.auth.userId;

        if (!clerkID) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Find the actual user ID from Clerk ID
        const loggedinUser = await User.findOne({ clerkId: clerkID });
        if (!loggedinUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const userId = loggedinUser._id;

        // Check if channel exists
        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ success: false, message: "Channel not found" });
        }

        // Check if the user is part of the channel
        if (!channel.users.includes(userId)) {
            return res.status(403).json({ success: false, message: "User is not a member of this channel" });
        }

        // Fetch all messages for the channel
        const messages = await ChannelMessage.find({ channelId }).sort({ createdAt: 1 })
        .populate("senderId")
        .exec();

        res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        console.error("Error fetching channel messages:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};