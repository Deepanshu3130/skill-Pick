import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPlatformCourses } from '../operations/apiConnectors';
import useCourseStore from '../store/useCourseStore';
import CourseCard from "../Components/CourseCard"
// import  youtubeImg from ".../public/youtube-logo.png"
// //         socket1 = null;
// import udemyImg from ".../udemy-logo.webp"
// import courseraImg from ".../coursera-logo.png"


function Courses() {
  const {setPlatformCourses, lastQuery, platformCourses} = useCourseStore()
  const [loading, setLoading] = useState(false);
  const {platform} = useParams();
  let img = null;
  if (platform === "Youtube") {
    img = "/youtube-logo.jpg";  // no import needed
  } else if (platform === "Udemy") {
    img = "/udemy-logo.png";
  } else {
    img = "/coursera-logo.webp";
  }

  useEffect(() => {
    
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await getPlatformCourses(platform);
        setPlatformCourses(response.data.data);
        
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [setPlatformCourses]);
  




  return (
    <div className='h-full'>
<div className='h-fit w-full bg-base-200 pb-6 flex justify-between'>
  <div className='w-[70%] pt-25 px-4 mx-auto flex items-center'>
    <div className='max-w-[50%]'>
      <h1 className='text-4xl font-bold tracking-wide'>
        Search results for <span className='font-extrabold text-primary'>{platform}</span>
      </h1>
      {/* Dynamic description based on platform */}
      {platform === 'YouTube' && (
        <p className='mt-2 text-gray-600'>
          YouTube is the world's largest video-sharing platform where you can learn, entertain, and explore millions of videos.
        </p>
      )}
      {platform === 'Udemy' && (
        <p className='mt-2 text-gray-600'>
          Udemy is an online learning platform with thousands of courses on programming, business, design, and more.
        </p>
      )}
      {platform === 'Coursera' && (
        <p className='mt-2 text-gray-600'>
          Coursera partners with top universities to offer courses, certificates, and degrees in various subjects.
        </p>
      )}
      
    </div>
    <img 
  src={img} 
  alt={`${platform} logo`} 
  className="ml-auto w-50 object-contain" 
 
/>
  </div>
</div>
     
     <div className="flex w-9/12 mx-auto h-full">
        
     
        {/* Courses List */}
        <div className="flex-1 p-6 h-fit">
          {loading ? (
            <div className="flex justify-center items-center ">
              <span className="loading loading-spinner loading-lg text-primary h-screen"></span>
            </div>
          ) :(
            <div className="space-y-6">
              {platformCourses.map(course => (
                <Link to={`/course/${course._id}`} key={course._id}>
                  <CourseCard course={course} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
     </div>
   
  )
}

export default Courses