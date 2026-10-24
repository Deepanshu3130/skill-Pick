const axios = require('axios');
require('dotenv').config();

const parseDuration = (isoDuration) => {
    if (!isoDuration) return 0;
    const hoursMatch = isoDuration.match(/(\d+)H/);
    const minutesMatch = isoDuration.match(/(\d+)M/);
    return (parseInt(hoursMatch?.[1] || 0, 10)) + 
           (parseInt(minutesMatch?.[1] || 0, 10) / 60);
};

const youtubeVideos = async (query, minHours = 2) => {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const BASE_URL = "https://www.googleapis.com/youtube/v3";
    
    if (!API_KEY) {
        console.warn("Missing YOUTUBE_API_KEY in .env file.");
        return [];
    }

    try {
        const searchResponse = await axios.get(`${BASE_URL}/search`, {
            params: {
                part: 'snippet',
                q: `${query} full course`,
                type: 'video',
                videoDuration: 'long',
                maxResults: 25,
                order: 'viewCount',
                regionCode: 'IN',
                key: API_KEY
            }
        });

        if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
            return [];
        }

        const videoIds = searchResponse.data.items
            .map(item => item.id?.videoId)
            .filter(Boolean)
            .join(',');

        if (!videoIds) return [];

        const detailsResponse = await axios.get(`${BASE_URL}/videos`, {
            params: {
                part: 'contentDetails,snippet',
                id: videoIds,
                key: API_KEY
            }
        });

        const items = detailsResponse.data?.items || [];
        return items
            .filter(video => parseDuration(video.contentDetails?.duration) >= minHours)
            .map(video => ({
                platform: 'YouTube',
                type: 'course',
                pricingType: 'free',
                title: video.snippet.title,
                level: 'intermediate',
                provider: video.snippet.channelTitle,
                description: video.snippet.description || video.snippet.channelTitle,
                id: video.id,
                externalId: video.id,
                duration: "Approx " + Math.floor(parseDuration(video.contentDetails?.duration)) + ' hours',
                imageUrl: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url || 'https://via.placeholder.com/400x225',
                link: `https://www.youtube.com/watch?v=${video.id}`,
                status: 'approved',
                roomId: `course:${video.id}`
            }));
    } catch (error) {
        console.error("YouTube Videos API Error:", error.response?.data?.error?.message || error.message);
        return [];
    }
};

const youtubePlaylists = async (query) => {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const BASE_URL = "https://www.googleapis.com/youtube/v3";
    const BASE_URL1 = "https://www.googleapis.com/youtube/v3/playlists";

    if (!API_KEY) {
        console.warn("Missing YOUTUBE_API_KEY in .env file.");
        return [];
    }

    try {
        const playlistResponse = await axios.get(`${BASE_URL}/search`, {
            params: {
                part: 'snippet',
                q: `${query} full course playlist`,
                type: 'playlist',
                maxResults: 25,
                order: 'viewCount',
                regionCode: 'IN',
                key: API_KEY
            }
        });

        if (!playlistResponse.data.items || playlistResponse.data.items.length === 0) {
            return [];
        }

        const playlistIds = playlistResponse.data.items
            .map(item => item.id?.playlistId)
            .filter(Boolean)
            .join(',');

        if (!playlistIds) return [];

        const response = await axios.get(BASE_URL1, {
            params: {
                part: 'snippet,contentDetails',
                id: playlistIds,
                key: API_KEY
            }
        });

        const items = response.data?.items || [];
        return items.map(playlist => ({
            platform: 'YouTube',
            type: 'course',
            pricingType: 'free',
            title: playlist.snippet.title,
            provider: playlist.snippet.channelTitle,
            description: playlist.snippet.description,
            lectures: `${playlist.contentDetails?.itemCount || 0} videos`,
            link: `https://www.youtube.com/playlist?list=${playlist.id}`,
            imageUrl: playlist.snippet?.thumbnails?.high?.url || playlist.snippet?.thumbnails?.default?.url || 'https://via.placeholder.com/400x225',
            level: 'intermediate',
            id: playlist.id,
            externalId: playlist.id,
            status: 'approved',
            roomId: `course:${playlist.id}`
        }));
    } catch (error) {
        console.error("YouTube Playlists API Error:", error.response?.data?.error?.message || error.message);
        return [];
    }
};

exports.youtubeCourses = async (query) => {
    try {
        const playlists = await youtubePlaylists(query);
        const videos = await youtubeVideos(query, 2);
        return [...(Array.isArray(playlists) ? playlists : []), ...(Array.isArray(videos) ? videos : [])];
    } catch (error) {
        console.error("Error fetching YouTube courses:", error.message);
        return [];
    }
};
