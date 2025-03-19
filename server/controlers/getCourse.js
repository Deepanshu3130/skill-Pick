const courseDetail = require('../model/courseDetail');
const getCourse = require('../utils/gatherData');

exports.getCourses = async(req, res) =>{
    try{
        const {query} = req.query;
        const coursesData = await gatherData(query);
        // save the data to the database
        if (!coursesData){
            return res.status(404).json({
                message: 'No data found'
            });
        }
        const{
            platform,
            provider,
            title,
            description,
            imageurl,
            duration,
            lectures,
            link,
            type,
            rating,
            reviews,
            skillPickRating,
            level
        } = coursesData;

        const courseData = courseDetail.create({ 
            platform,
            provider,
            title,
            description,
            imageurl,
            duration,
            lectures,
            link,
            type,
            rating,
            reviews,
            skillPickRating,
            level
        });
        console.log("data from all platform is",courseData);
       return res.status(200).json({
           Success: true,
           message: 'Data stored successfully from all platforms',
           data: courseData
       });

    }catch(error){
        return res.json({
            success: false,
            message: "fail to get the course data",
            error : error.message
        })
    }
}