const courseDetail = require("../model/courseDetail");

exports.getYoutubeCourses = async (req, res) => {
    try {
        const youtubeCourse = await courseDetail.find({ platform: "YouTube" });
        if (!youtubeCourse || youtubeCourse.length === 0) {
            return res.status(404).json({ success: false, message: "No courses found" });
        }
        return res.status(200).json({ success: true, data: youtubeCourse });
    } catch (error) {
        console.error("Error fetching youtube courses:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

exports.getGithubRepos = async (req, res) => {
    try {
        const repos = await courseDetail.find({ platform: "GitHub" });
        if (!repos || repos.length === 0) {
            return res.status(404).json({ success: false, message: "No repositories found" });
        }
        return res.status(200).json({ success: true, data: repos });
    } catch (error) {
        console.error("Error fetching github repos:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

exports.getPaidCourses = async (req, res) => {
    try {
        const paidCourse = await courseDetail.find({ pricingType: "paid" });
        return res.status(200).json({ success: true, data: paidCourse || [] });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

exports.getFreeCourses = async (req, res) => {
    try {
        const freeCourse = await courseDetail.find({ pricingType: "free" });
        return res.status(200).json({ success: true, data: freeCourse || [] });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

exports.getPlatformCourses = async (req, res) => {
    try {
        const platformCourse = await courseDetail.find({ platform: req.params.platform });
        if (!platformCourse || platformCourse.length === 0) {
            return res.status(404).json({ success: false, message: "No resources found" });
        }
        return res.status(200).json({ success: true, data: platformCourse });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};
