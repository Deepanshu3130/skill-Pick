import React from 'react'
import { useParams } from 'react-router-dom'
import { courseDetail, joinChannel } from '../operations/apiConnectors';
import { useState, useEffect } from 'react';
// import { StarIcon, BookmarkIcon, ShareIcon } from '@heroicons/react/24/solid';
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";


 // Initialize navigation hook

function CourseDescription() {

  
  const{getToken} = useAuth();
    const {id} = useParams();
    const [course, setCourse] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
          try {
            setLoading(true)
            const response = await courseDetail(id)
            setCourse(response.data.data);
          } catch (error) {
            console.error("Error fetching course:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchCourse();
      }, [id]);

      
  const handleJoinCommunity = async (e) => {
    e.preventDefault();
     const token = await getToken(); 
  
    try {
      console.log("Joining community...");
  
      // Call API to join the community
      const response = await joinChannel(token,course._id); 
  
      if (response.data.success) {
        console.log("Successfully joined the community!");
        navigate(`/`); // Redirect to the community page
      } else {
        console.error("Failed to join community:", response.message);
      }
    } catch (error) {
      console.error("Error joining community:", error);
    }
  };

  return (
    <div className="min-h-screen  pt-20 h-full">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Course Meta */}
          <div className="lg:col-span-1 bg-base-300 p-6 rounded-lg shadow-md">
            <img 
              src={course.imageUrl} 
              alt="Course cover" 
              className="w-full h-48 object-cover rounded-md mb-6"
            />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {course.platform}
                </span>
                {/* <div className="flex items-center space-x-2">
                  <StarIcon className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-medium">{course.rating}</span>
                  <span className="text-gray-500 text-sm">({course.reviews} reviews)</span>
                </div> */}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Language</span>
                  <span className="font-medium">{course.language || 'English'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Access</span>
                  <span className="font-medium">On-Demand</span>
                </div>
              </div>

              <button onClick={handleJoinCommunity} className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition">
               Join community
              </button>
              <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-md mt-2 hover:bg-blue-50 transition">
                Add to List
              </button>
            </div>
          </div>

          {/* Main Content - Course Description */}
          <div className="lg:col-span-2 bg-base-200 p-6 rounded-lg shadow-md">
            <div className="mb-8">
              <span className="text-sm text-gray-500">{course.provider}</span>
              <h1 className="text-3xl font-bold mt-2 mb-4">{course.title}</h1>
              
              {/* <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <StarIcon
                      key={rating}
                      className="h-5 w-5 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-gray-600">{course.reviews} reviews</span>
              </div> */}

              <p className="text-gray-700 leading-relaxed mb-8">
                {course.description}
              </p>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">What you'll learn</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learnings?.map((learning, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-blue-600 mr-2">✓</span>
                      {learning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Course Actions */}
          <div className="lg:col-span-3 xl:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Course Includes</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2">🎥</span>
                    {course.duration} hours on-demand video
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">📄</span>
                    Downloadable resources
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">📱</span>
                    Access on mobile and TV
                  </li>
                </ul>
              </div>

              <div className="border-t pt-6">
                <button className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-600">
                  {/* <BookmarkIcon className="h-5 w-5" /> */}
                  <span>Save to Bookmarks</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 mt-4 text-gray-600 hover:text-blue-600">
                  {/* <ShareIcon className="h-5 w-5" /> */}
                  <span>Share Course</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDescription