import React from 'react'
import { useParams } from 'react-router-dom'
import { courseDetail, joinChannel } from '../operations/apiConnectors';
import { useState, useEffect } from 'react';
import { useAuth,useUser} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import AuthModal from '../Components/AuthModal';

function CourseDescription() {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
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

  useEffect(() => {
    if (!isSignedIn) {
      setShowAuthModal(true);
    }
  }, [isSignedIn])

  const handleJoinCommunity = async (e) => {
    e.preventDefault();
    const token = await getToken();
    try {
      const response = await joinChannel(token, course._id);
      if (response.data.success) {
        navigate(`/chatHome`);
      }
    } catch (error) {
      console.error("Error joining community:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Course Meta */}
          <div className="lg:col-span-1 bg-base-200 p-6 rounded-box shadow-sm">
            <div className="flex flex-col gap-4">
              <img 
                src={course.imageUrl || 'https://via.placeholder.com/400x225'} 
                alt="Course cover" 
                className="w-full h-40 object-cover rounded-lg"
              />
              
              <div className="badge badge-primary">{course.platform}</div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                {course.duration ?(
                <div className='text-sm text-gray-500 flex items-center gap-6'>
              <span className="font-medium">Duration:</span> {course.duration}
            </div>
              ): (
                <div className='text-sm text-gray-500  flex items-center gap-6'>
              <span className="font-medium">lectures:</span> {course.lectures}
            </div>
              )
            }
                </div>
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                  <span className="text-sm text-gray-500">Language</span>
                  <span className="font-medium">{course.language || 'English'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                  <span className="text-sm text-gray-500">Access</span>
                  <span className="font-medium">On-Demand</span>
                </div>
              </div>

              <button 
                onClick={handleJoinCommunity}
                className="btn btn-primary w-full"
              >
                Join community
              </button>
              <a href={course.link} target="_blank" rel="noopener noreferrer">
                <button className="btn btn-outline w-full">
                 visit Course
                  </button>
              </a>
            </div>
          </div>

          {/* Main Content - Course Description */}
          <div className="lg:col-span-2 bg-base-200 p-6 rounded-box shadow-sm">
            <div className="space-y-4">
              <span className="text-sm text-gray-500">{course.provider}</span>
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <div className="bg-base-300 p-4 rounded-box">
                <h3 className="text-lg font-semibold mb-3">What you'll learn</h3>
                
              </div>
              <p className="text-gray-700">
                {course.description}
              </p>
            </div>
          </div>

          {/* Right Sidebar - Course Includes */}
          <div className="lg:col-span-1 bg-base-200 p-6 rounded-box shadow-sm">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Course Includes</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="text-primary">🎥</span>
                  <span>{course.duration} hours on-demand video</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">📄</span>
                  <span>Downloadable resources</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">📱</span>
                  <span>Access on mobile and TV</span>
                </li>
              </ul>

              <div className="divider"></div>

              <button className="btn btn-ghost w-full justify-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Save to Bookmarks
              </button>
            </div>
          </div>
        </div>
      </div>
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  )
}

export default CourseDescription