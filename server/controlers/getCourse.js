const courseDetail = require('../model/courseDetail');
const gatherData = require('../utils/gatherData');

exports.getCourses = async(req, res) =>{
    try{
        const {query} = req.body;
        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Query parameter is required"
            });
        }
        console.log("query is",query);
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