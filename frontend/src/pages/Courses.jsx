import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourses } from '../operations/apiConnectors';
import useCourseStore from '../store/useCourseStore';
import CourseCard from "../Components/CourseCard"

function Courses() {
  const {courses, lastQuery, setCourses, setLastQuery} = useCourseStore()
  const [loading, setLoading] = useState(false);
  const {query} = useParams();
  const [filters, setFilters] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
     const [selectedPrice, setSelectedPrice] = useState(null);

  useEffect(() => {
    if (query === lastQuery) return;
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
  
  const handleFilterChangePlatform = (platform) => {
    if(selectedPrice){
      setSelectedPrice(null);
    }
    if (selectedPlatform === platform) {
      setFilters(null); 
      setSelectedPlatform(null);
      return; 
    }
    setSelectedPlatform(platform);
     const result = courses.filter(course => course.platform === platform);
     setFilters(result);
   
  }

  const handleFilterChangePrice = (type) => {
    if(selectedPlatform){
      setSelectedPlatform(null);
    }
    if (selectedPrice === type) {
      setFilters(null);
      setSelectedPrice(null);
    } else {
      setSelectedPrice(type);
      const result = courses.filter(course => course.type === type);
      setFilters(result);
    }
    
  }

  return (
    <div className='h-full w-full'>
    <div className='h-fit w-full bg-base-200  pb-6'>
      <div className='w-[70%] pt-25 px-4  mx-auto flex items-center  '>
        
          <h1 className='text-4xl font-bold tracking-wide max-w-[30%] '>Search results for <span className='font-extrabold 	text-primary'>{query}</span></h1>
        
      </div>

    </div>
      <div className="flex w-11/12 mx-auto ">
        {/* Filter Sidebar */}
        <div className="w-64 p-6 border-r border-base-300 h-screen">
          <h2 className="text-xl font-bold mb-6">Filters</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-extrabold text-sm uppercase mb-3">Platform</h3>
              <div className="space-y-2">
                {['Udemy', 'YouTube', 'Coursera'].map(platform => (
                   <button key={platform}
                   onClick={() => handleFilterChangePlatform(platform)}
                   className={`flex rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200
                            ${selectedPlatform === platform ? 'bg-primary text-accent' : 'hover:bg-primary hover:text-accent'}`}
                                                                                                                                >
                    {platform}
                    
                   </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-extrabold text-sm uppercase mb-3">Price</h3>
              <div className="space-y-2">
                {['free', 'paid'].map(price => (
                  <button key={price}
                  onClick={() => handleFilterChangePrice(price)}
                  className={`flex rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200
                            ${selectedPrice === price ? 'bg-primary text-accent' : 'hover:bg-primary hover:text-accent'}`}
                                                                                                                                >
                    {price}
                    
                   </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="flex-1 p-6 h-full">
        {selectedPlatform === "Udemy" && filters && filters.length === 0 && (
          <div className="text-center p-8 bg-base-200 rounded-lg">
            <p className="text-lg font-medium text-gray-600">
              We're having trouble loading Udemy courses right now.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Our team is working on this issue. For better results, you can try running locally.
            </p>
          </div>
          )}
       
          {loading ? (
            <div className="flex justify-center items-center ">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : !filters  ?(
            <div className="space-y-6">
              {courses.map(course => (
                <Link to={`/course/${course._id}`} key={course._id}>
                  <CourseCard course={course} />
                </Link>
              ))}
            </div>
          ):(
            <div className="space-y-6">
              {filters.map(course => (
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