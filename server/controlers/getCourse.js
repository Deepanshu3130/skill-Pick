
const courseDetail = require('../model/courseDetail');
const gatherData = require('../utils/gatherData');
const Query = require("../model/query")

exports.getCourses = async(req, res) =>{
    try{
        
        const {query} = req.body;
        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Query parameter is required"
            });
        }
        const existingQuery  =await Query.findOne({query});
        if(existingQuery ){
            const result = await courseDetail.find({query:query})
            return res.status(200).json({
                Success: true,
                message: 'got the data successfully',
                data: result
            });


        }
        await Query.create({
            query
        })
        
        const coursesData = await gatherData.gatherData(query);
        // save the data to the database
        if (coursesData.length === 0) {
            return res.status(404).json({
                message: 'No data found'
            });
        }
        //console.log("data from all platform is",coursesData);
        const updatedCoursesData = coursesData.map(course => ({
            ...course,   
            query: query
        }));
        const result = await courseDetail.insertMany(updatedCoursesData);
        // const promises =coursesData.map((data)=>{
           
        //     const{
        //         platform,
        //         provider,
        //         title,
        //         description,
        //         imageUrl,
        //         duration,
        //         lectures,
        //         link,
        //         type,
        //         rating,
        //         reviews,
        //         skillPickRating,
        //         level,
        //     } = data
           
        // return  courseDetail.create({ 
        //     platform,
        //     provider,
        //     title,
        //     description,
        //     imageUrl,
        //     duration,
        //     lectures,
        //     link,
        //     type,
        //     rating,
        //     reviews,
        //     skillPickRating,
        //     level
        // });

        // })
        // const result = await Promise.all(promises);



        console.log("data from all platform is",result, "end");
       return res.status(200).json({
           Success: true,
           message: 'Data stored successfully from all platforms',
           data: result
       });

    }catch(error){
        return res.json({
            success: false,
            message: "fail to get the course data",
            error : error.message
        })
    }
}



exports.getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await courseDetail.findById(id);

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
