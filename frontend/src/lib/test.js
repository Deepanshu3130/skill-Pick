import axios from 'axios';

const sendMessage = async (token) => {
  try {
    const response = await axios.post(
      // Correct URL with path parameter
     `http://localhost:3000/api/v1/courseData/sendMessage/67e54ca660b1138bb02189d1`,
      
      // Required request body matching backend expectations
      {
        text: "what the fck cutii",
        image: "" // Add image URL if needed or leave empty
      },
      
      // Proper headers
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          
        }
      }
    );
    console.log(response.data) ;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export default sendMessage;