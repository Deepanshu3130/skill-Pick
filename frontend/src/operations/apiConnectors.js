 import axios from "axios";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

const rawBase = import.meta.env.VITE_BASE_URL ? import.meta.env.VITE_BASE_URL.trim() : "";
const BASE_URL = rawBase || (import.meta.env.MODE === "development" ? "http://localhost:3000/api/v1" : "/api/v1");
const API_ROOT = BASE_URL.replace(/\/v1$/, "");
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



export const getTopicResources = async (slug, token = null) => {
  try {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await axios.get(`${API_ROOT}/topics/${encodeURIComponent(slug)}/resources`, { headers });
    return response;
  } catch (error) {
    console.error("GET TOPIC RESOURCES API ERROR:", error);
    return false;
  }
};

export const submitResourceLink = async (url, topicSlug, token) => {
  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await axios.post(
      `${API_ROOT}/resources/from-link`,
      { url, topicSlug },
      { headers }
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { status: "service_busy", message: "Server connection failed" };
  }
};

export const searchWebResources = async (query, topicSlug, token) => {
  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await axios.post(
      `${API_ROOT}/resources/search`,
      { query, topicSlug },
      { headers }
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { status: "service_busy", message: "Search service unavailable" };
  }
};

export const pickResourceItem = async (searchId, index, token) => {
  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await axios.post(
      `${API_ROOT}/resources/pick`,
      { searchId, index },
      { headers }
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { status: "service_busy", message: "Failed to pick resource" };
  }
};

export const searchGithubReposApi = async (query, topicSlug, token) => {
  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await axios.post(
      `${API_ROOT}/resources/github-search`,
      { query, topicSlug },
      { headers }
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { status: "service_busy", message: "GitHub search unavailable" };
  }
};

export const pickGithubRepoItem = async (searchId, index, token) => {
  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await axios.post(
      `${API_ROOT}/resources/pick-repo`,
      { searchId, index },
      { headers }
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { status: "service_busy", message: "Failed to pick repo" };
  }
};

export const submitManualResource = async ({ url, title, description, topicSlug }, token) => {
  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await axios.post(
      `${API_ROOT}/resources/manual`,
      { url, title, description, topicSlug },
      { headers }
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { status: "service_busy", message: "Failed to submit manual resource" };
  }
};

export const upvoteResource = async (id, token) => {
  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await axios.post(`${API_ROOT}/resources/${id}/upvote`, {}, { headers });
    if (response.data) {
      toast.success("Upvoted!");
      return response.data;
    }
  } catch (error) {
    toast.error("Could not register upvote");
    return false;
  }
};

export const reportResource = async (id, token) => {
  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await axios.post(`${API_ROOT}/resources/${id}/report`, {}, { headers });
    if (response.data) {
      toast.success("Report submitted for review");
      return response.data;
    }
  } catch (error) {
    toast.error("Could not register report");
    return false;
  }
};
