// exports.signup = async (req, res) => {
//     const {email, fullName, password,  profilePicture} = req.body; 
//     //add confirm password later on if u fell like adding
//     try{
//         if(!email || !fullName || !password){
//             return res.status(400).json({
//                 success: false,
//                 message: 'All fields are required'
//             });
//         }
//         //check if user already exists
//         const checkUser = await User.findOne({email});
//         if(checkUser){
//             return res.status(400).json({
//                 success: false,
//                 message: 'User already exists , please login'
//             });
//         }

//     }catch(error){
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// }

const User = require("../model/user");
exports.clerkWebhook = async (req, res) => {
  try { 
    const {type,data} = req.body
    if(type === "user.deleted"){
        await User.deleteOne({ clerkId: data.id });
      console.log("User deleted from MongoDB");
      return res.status(200).json({ success: true });
    }
    if(type === "user.created" || type === "user.updated"){
        const { id, email_addresses, username, first_name, last_name, image_url } = data;
      let user = await User.findOne({ clerkId: id });
      
      if (user) {
          // Update existing user
          user.firstName = first_name;
          user.lastName = last_name;
          user.profileImage = image_url;
          user.username = username;
      } else {
          // Create new user
          user = new User({
              clerkId: id,
              email: email_addresses[0]?.email_address,
              firstName: first_name,
              lastName: last_name,
              profileImage: image_url,
              username: username,  // Include username
          });
      }

      await user.save();
      console.log("User synced with MongoDB:", user);

      return res.status(200).json({ success: true, message: "User synced successfully" });
    }

  } catch (error) {
      console.error("Error saving user to DB:", error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
  
    }
      
};

// manage delete case too 
