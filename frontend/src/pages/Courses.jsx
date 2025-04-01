import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourses } from '../operations/apiConnectors';
import useCourseStore from '../store/useCourseStore';
import CourseCard from "../Components/CourseCard"

function Courses() {
   const {courses , lastQuery, setCourses, setLastQuery} = useCourseStore()
   const [loading, setLoading] = useState(false);
    const {query} = useParams();


    useEffect(() => {
      if (query === lastQuery) return;  // ✅ Avoid unnecessary fetch

      const fetchCourses = async () => {
          setLoading(true);
          try {
              const response = await getCourses(query);
              setCourses(response.data.data);
              setLastQuery(query);
          } catch (error) {
              console.error("Error fetching courses:", error);
          } finally {
              setLoading(false);
          }
      };

      fetchCourses();
  }, [query, lastQuery, setCourses, setLastQuery]);
  return (
     <div className='h-full'>
    <div className='h-fit w-full bg-base-200  pb-6'>
      <div className='w-[70%] pt-25 px-4  mx-auto flex items-center  '>
        
          <h1 className='text-4xl font-bold tracking-wide max-w-[30%] '>Search results for <span className='font-extrabold 	text-accent'>{query}</span></h1>
        
      </div>

    </div>

    <div className=' w-full h-full shadow-lg  ' >
        
        {loading ? <div className='h-screen'>LOADING.....</div>: 
           
          <div  className='w-[70%] pt-25 px-4  mx-auto flex items-center flex-col gap-8'>
        {courses.map((course)=>(
         <Link to={`/course/${course._id}`} key={course._id}>
        
          <CourseCard  course={course} 
          ></CourseCard>
          
         </Link>
          
        ))}
         
         
      </div>}

      
      
    </div>

  
     </div>
  )
}

export default Courses