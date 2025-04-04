
const courseDetail = require("../model/courseDetail");

exports.getYoutubeCourses = async(req,res)=>{
    try{
        const youtubeCourse = await courseDetail.find({provider:"youtube"});
        if(!youtubeCourse){
            return res.status(404).json({success:false,message:"No courses found"})
        }
        return res.status(200).json({success:true,data:youtubeCourse}) 

    }catch(error){
        console.error("Error fetching youtube courses:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}
exports.getUdemyCourses1 = async(req,res)=>{
    try{
        const udemyCourse = await courseDetail.find({provider:"udemy"});
        if(!udemyCourse){
            return res.status(404).json({success:false,message:"No courses found"})
        }
        return res.status(200).json({success:true,data:udemyCourse}) 

    }catch(error){
        console.error("Error fetching youtube courses:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}
exports.getCourseraCourses1 = async(req,res)=>{
    try{
        const courseraCourse = await courseDetail.find({provider:"coursera"});
        if(!courseraCourse){
            return res.status(404).json({success:false,message:"No courses found"})
        }
        return res.status(200).json({success:true,data:courseraCourse}) 

    }catch(error){
        console.error("Error fetching youtube courses:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

exports.getPaidCourses = async(req,res)=>{
    try{
        const paidCourse = await courseDetail.find({type:"paid/temp"});
        if(!paidCourse){
            return res.status(404).json({success:false,message:"No courses found"})
        }
        return res.status(200).json({success:true,data:paidCourse}) 

    }catch(error){
        console.error("Error fetching youtube courses:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}
exports.getFreeCourses = async(req,res)=>{
    try{
        const freeCourse = await courseDetail.find({type:"free"});
        if(!freeCourse){
            return res.status(404).json({success:false,message:"No courses found"})
        }
        return res.status(200).json({success:true,data:freeCourse}) 

    }catch(error){
        console.error("Error fetching youtube courses:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}