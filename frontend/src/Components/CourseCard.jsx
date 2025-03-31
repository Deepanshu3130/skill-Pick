import React from 'react'

function CourseCard() {
  return (
    <div className="flex flex-row w-full max-w-[750px] h-auto p-4 bg-white shadow-lg rounded-lg border border-gray-300">
    {/* left section */}
        <div className="flex flex-col w-[70%] gap-4">
            <div className='flex flex-row items-start  gap-4'>
                <div  className='w-[30%]'>
                    <img src='https://static8.depositphotos.com/1012223/980/i/450/depositphotos_9803930-stock-photo-demo-cubes.jpg://depositphotos.com/photos/demo.html'/>
                </div>
                <div className='flex flex-col w-[70%]'>
                    <p className='font-bold text-4xl '>this is just a sample title</p>
                    <p>do review star</p>

                </div>
            </div>
            <div>
                <p>description</p>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">bookmark button</button>
            </div>
                
        </div>

        <div lassName="flex flex-col w-[30%] gap-2 border-l pl-4 text-gray-700">
            <p className="border-b-2">platform name </p>
            <p className="border-b-2">course provider</p>
            <p className="border-b-2">duration</p>
            <p className="border-b-2">free/paid</p>
            <p className="border-b-2">ondemad</p>
        </div>
    </div>
  )
}

export default CourseCard