 import axios from "axios";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
 const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000/api/v1" : "/api/v1";
export const getUsers = async(token)=>{
    
    
    try{
          const response = await axios.get(
            // Correct URL with path parameter
             BASE_URL+`/courseData/getUsers`,
            
            // Required request body matching backend expectations
            // {
            //   text: "what ,
            //   image: "" // Add image URL if needed or leave empty
            // },
            
            // Proper headers
            {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                
              }
            }
          );
        console.log("getallcourse API RESPONSE............", response)
        if(!response.data.success){
            throw new Error("Could Not USERS")
        }
       
        return response;
    }catch(error){
        console.log("GET_ALL_COURSE_API API ERROR............", error);
        return false
    }
    
}

export const getMessages = async(userId ,token)=>{
    
    
    try{
          const response = await axios.get(
            // Correct URL with path parameter
             BASE_URL+`/courseData/getMessages/${userId}`,
            
            // Required request body matching backend expectations
            // {
            //   text: "what ,
            //   image: "" // Add image URL if needed or leave empty
            // },
            
            // Proper headers
            {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                
              }
            }
          );
        console.log("GETMESSAGES API RESPONSE............", response)
        if(!response.data.success){
            throw new Error("Could Not USERS")
        }
       
        return response;
    }catch(error){
        console.log("GET MESSAGES_COURSE_API API ERROR............", error);
        return false
    }
    
}

export const sendMessage = async(text,img,token,selectedUser)=>{
    
    
    try{
          const response =  await axios.post(
            // Correct URL with path parameter
            BASE_URL+`/courseData/sendMessage/${selectedUser._id}`,
            {
                text: text.trim(),
                image: img,
                receverClerkId: selectedUser.clerkId,
            },
            
            // Required request body matching backend expectations
            // {
            //   text: "what the fck cutii",
            //   image: "" // Add image URL if needed or leave empty
            // },
            
            // Proper headers
            {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                
              }
            }
          );
    
        return response;
    }catch(error){
        console.log("GET MESSAGES_COURSE_API API ERROR............", error);
        return false
    }
    
}



export const getCourses = async(query)=>{
    
    
    try{
          const response =  await axios.post(
            // Correct URL with path parameter
            BASE_URL+`/courseData/getCourse`,
            {
               query
            },
            
            // Required request body matching backend expectations
            // {
            //   text: "what the fck cutii",
            //   image: "" // Add image URL if needed or leave empty
            // },
            
            // Proper headers
            // {
            //   headers: {
            //     "Authorization": `Bearer ${token}`,
            //     "Content-Type": "application/json",
                
            //   }
            // }
          );
      console.log(response)
        return response;
    }catch(error){
        console.log("GET courses API ERROR............", error);
        return false
    }
    
}

export const courseDetail = async(id)=>{
  try{
    console.log("callilng")
    const response =  await axios.get(
      // Correct URL with path parameter
      BASE_URL+`/courseData/getCourseById/${id}`,
      
      
     
    );
console.log("got the res",response)
  return response;
}catch(error){
  console.log("GET COURSE DETAILS  API ERROR............", error);
  return false
}

}


export const getJoinedCommunities = async(token)=>{
    
    
  try{
        const response = await axios.get(
          // Correct URL with path parameter
           BASE_URL+`/courseData/getUserChannels`,
          
          // Required request body matching backend expectations
          // {
          //   text: "what ,
          //   image: "" // Add image URL if needed or leave empty
          // },
          
          // Proper headers
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
              
            }
          }
        );
      console.log("getallcourse API RESPONSE............", response)
      if(!response.data.success){
          throw new Error("Could Not USERS")
      }
     
      return response;
  }catch(error){
      console.log("GET_ALL_COURSE_API API ERROR............", error);
      return false
  }
  
}

export const getCommunityMessages = async(channelId ,token)=>{
    
    
  try{
        const response = await axios.get(
          // Correct URL with path parameter
           BASE_URL+`/courseData/getMessagesForChannel/${channelId}`,
          
          // Required request body matching backend expectations
          // {
          //   text: "what ,
          //   image: "" // Add image URL if needed or leave empty
          // },
          
          // Proper headers
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
              
            }
          }
        );
      console.log("GETMESSAGES from community  API RESPONSE............", response)
      if(!response.data.success){
          throw new Error("Could Not USERS")
      }
     
      return response;
  }catch(error){
      console.log("GET MESSAGES_COURSE_API API ERROR............", error);
      return false
  }
  
}


export const sendCommunityMessage = async(text,img,token,selectedCommunity)=>{
    
  try{
        const response =  await axios.post(
          // Correct URL with path parameter
          BASE_URL+`/courseData/sendMessageToChannel/${selectedCommunity._id}`,
          {
              text: text.trim(),
              image: img,
              
          },
          
          // Required request body matching backend expectations
          // {
          //   text: "what the fck cutii",
          //   image: "" // Add image URL if needed or leave empty
          // },
          
          // Proper headers
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
              
            }
          }
        );
  
      return response;
  }catch(error){
      console.log("GET MESSAGES_COURSE_API API ERROR............", error);
      return false
  }
  
}


export const joinChannel = async (token, courseId) => {
  const toastId = toast.loading("Joining Channel...");

  try {
    const response = await axios.post(
      BASE_URL + `/courseData/joinChannel`,
      { courseId: courseId },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.success) {
      toast.error(response.data.message); // ✅ display actual message
      return false;
    }

    toast.success("Joined Channel Successfully ✅");
    return response;

  } catch (error) {
    console.log("JOIN CHANNEL API ERROR:", error);
    toast.error("Failed to join channel ❌");
    return false;

  } finally {
    toast.dismiss(toastId);
  }
};
export const getPlatformCourses = async(platform)=>{
  try{
    const response = await axios.get(
    
       BASE_URL+`/courseData/getPlatformCourses/${platform}`,
      
    
      
    );
  console.log("GETMESSAGES API RESPONSE............", response)
  if(!response.data.success){
      throw new Error("Could Not USERS")
  }
 
  return response;
}catch(error){
  console.log("GET MESSAGES_COURSE_API API ERROR............", error);
  return false
} 
}