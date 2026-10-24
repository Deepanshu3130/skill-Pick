require('dotenv').config({ path: '../.env' });
const { youtubeCourses } = require('../youtubeData');

exports.gatherData = async (query) => {
    try {
        const youtubeResult = await youtubeCourses(query);
        const result = Array.isArray(youtubeResult) ? youtubeResult : [];
        console.log(`Gathered ${result.length} YouTube courses for query: "${query}"`);
        return result;
    } catch (error) {
        console.error("Error gathering course data:", error);
        return [];
    }
};
