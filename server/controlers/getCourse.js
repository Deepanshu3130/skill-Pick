const courseDetail = require('../model/courseDetail');
const gatherData = require('../utils/gatherData');
const Query = require("../model/query");

exports.getCourses = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Query parameter is required"
            });
        }

        const querySlug = query.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

        // Check if query exists or resources are already stored
        const existingResults = await courseDetail.find({
            $or: [
                { query: query },
                { topics: querySlug }
            ],
            status: "approved"
        });

        if (existingResults && existingResults.length > 0) {
            return res.status(200).json({
                Success: true,
                success: true,
                message: 'got the data successfully',
                data: existingResults
            });
        }

        // Create query record if not existing
        await Query.findOneAndUpdate(
            { query },
            { $set: { query } },
            { upsert: true }
        );

        // Fetch fresh courses from YouTube
        const coursesData = await gatherData.gatherData(query);

        if (!coursesData || coursesData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No data found'
            });
        }

        const bulkOps = coursesData.map(course => {
            const externalId = course.externalId || course.id || ('yt-' + Math.random().toString(36).slice(2, 10));
            return {
                updateOne: {
                    filter: { type: 'course', externalId },
                    update: {
                        $set: {
                            platform: course.platform || 'YouTube',
                            provider: course.provider || 'YouTube',
                            title: course.title,
                            description: course.description,
                            imageUrl: course.imageUrl,
                            duration: course.duration,
                            lectures: course.lectures,
                            link: course.link,
                            type: 'course',
                            pricingType: course.pricingType || 'free',
                            status: 'approved',
                            roomId: course.roomId || `course:${externalId}`,
                            level: course.level || 'intermediate',
                            query: query
                        },
                        $addToSet: {
                            topics: querySlug
                        }
                    },
                    upsert: true
                }
            };
        });

        await courseDetail.bulkWrite(bulkOps, { ordered: false });

        const savedResults = await courseDetail.find({
            $or: [
                { query: query },
                { topics: querySlug }
            ],
            status: "approved"
        });

        return res.status(200).json({
            Success: true,
            success: true,
            message: 'Data stored successfully',
            data: savedResults
        });
    } catch (error) {
        console.error("Error in getCourses:", error);
        return res.status(500).json({
            success: false,
            message: "fail to get the course data",
            error: error.message
        });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await courseDetail.findById(id);

        if (!course) {
            return res.status(404).json({ success: false, error: "Course not found" });
        }

        return res.status(200).json({ success: true, data: course });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error" });
    }
};
