import React from 'react'

function CourseCard({ course }) {
  return (
    <div className="card w-full  shadow-sm hover:shadow-md border border-base-200 bg-base-200 transition-all mb-4"> 
      <div className="flex flex-col md:flex-row">
        
        <figure className="w-full md:w-1/3 h-40 overflow-hidden border-r border-base-200"> 
          <img 
            src={course.imageUrl || 'https://via.placeholder.com/400x225'} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </figure>

        {/* Course Details */}
        <div className="card-body p-4 w-full md:w-2/3"> 
          {/* Title */}
          <h2 className="card-title text-lg">{course.title}</h2> 
          
          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p> 

          {/* Bookmark */}
          <div className="mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-xs" />
              <span className="text-xs">Bookmark</span> {/* Smaller text */}
            </label>
          </div>

          {/* Divider */}
          <div className="divider my-1"></div> 

         
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs"> 
            <div className="truncate">
              <span className="font-medium">Platform:</span> {course.platform}
            </div>
            <div className="truncate">
              <span className="font-medium">Provider:</span> {course.provider}
            </div>
            {
              course.duration ?(
                <div>
              <span className="font-medium">Duration:</span> {course.duration}
            </div>
              ): (
                <div>
              <span className="font-medium">lectures:</span> {course.lectures}
            </div>
              )
            }
            <div>
              <span className="font-medium">Type:</span> {course.type}
            </div>
            <div>
              <span className="font-medium">Delivery:</span> On Demand
            </div>
            <div>
              <span className="font-medium">mode:</span> 
              {
                <span className="text-success ml-1">Online</span>
            }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard