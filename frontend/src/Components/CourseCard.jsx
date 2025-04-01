import React from 'react'

function CourseCard({course}) {
    const trimDescription=(description)=>{
        
       return  description.length > 200?  description.slice(0, 100)+ "..." : description

    }
  return (
    <div className="flex flex-row w-full  min-w-[1080px] h-auto p-4 shadow-lg  gap-4 bg-base-200 border-0" >
     
    {/* left section */}
        <div className="flex flex-col w-[70%] gap-4">
            <div className='flex flex-row items-start  gap-4'>
                <div  className="">
                    <img src={course.imageUrl}/>
                </div>
                <div className='flex flex-col w-[90%]'>
                    <p className='font-bold text-xl '>{course.title}</p>
                    <p>do review star</p>

                </div>
            </div>
            <div>
                <p>{trimDescription(course.description)}</p>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">bookmark button</button>
            </div>
                
        </div>

        <div className="flex w-[30%] justify-center pl-2 flex-col gap-4 ">
            <p className="border-b-2">{course.platform} </p>
            <p className="border-b-2">{course.provider}</p>
            <p className="border-b-2">{course.duration}</p>
            <p className="border-b-2">{course.type}</p>
            <p className="border-b-2">on Demand</p>
        </div>
    </div>
  )
}

export default CourseCard