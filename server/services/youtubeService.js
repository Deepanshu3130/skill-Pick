const axios = require('axios');
require('dotenv').config();

const parseDuration = (isoDuration) => {
    if (!isoDuration) return 0;
    const hoursMatch = isoDuration.match(/(\d+)H/);
    const minutesMatch = isoDuration.match(/(\d+)M/);
    return (parseInt(hoursMatch?.[1] || 0, 10)) + 
           (parseInt(minutesMatch?.[1] || 0, 10) / 60);
};

const BASE_URL = "https://www.googleapis.com/youtube/v3";

/**
 * Fetch playlist metadata strictly by ID (1 quota unit).
 */
async function getYoutubePlaylistById(playlistId) {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    if (!API_KEY) {
        return { success: false, error: "API key not configured" };
    }

    try {
        const response = await axios.get(`${BASE_URL}/playlists`, {
            params: {
                part: 'snippet,contentDetails',
                id: playlistId,
                key: API_KEY
            },
            timeout: 5000
        });

        const item = response.data?.items?.[0];
        if (!item) {
            return { success: false, notFound: true };
        }

        const snippet = item.snippet || {};
        const contentDetails = item.contentDetails || {};

        return {
            success: true,
            data: {
                externalId: playlistId,
                kind: 'playlist',
                title: snippet.title || 'YouTube Playlist',
                description: snippet.description || '',
                channelOrOwner: snippet.channelTitle || 'YouTube',
                url: `https://www.youtube.com/playlist?list=${playlistId}`,
                thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || 'https://via.placeholder.com/400x225',
                videoCount: contentDetails.itemCount || 0,
                publishedAt: snippet.publishedAt
            }
        };
    } catch (error) {
        const status = error.response?.status;
        if (status === 403 || status === 429) {
            return { success: false, rateLimited: true, status: "service_busy" };
        }
        return { success: false, error: error.message };
    }
}

/**
 * Fetch video metadata strictly by ID (1 quota unit).
 */
async function getYoutubeVideoById(videoId) {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    if (!API_KEY) {
        return { success: false, error: "API key not configured" };
    }

    try {
        const response = await axios.get(`${BASE_URL}/videos`, {
            params: {
                part: 'snippet,contentDetails',
                id: videoId,
                key: API_KEY
            },
            timeout: 5000
        });

        const item = response.data?.items?.[0];
        if (!item) {
            return { success: false, notFound: true };
        }

        const snippet = item.snippet || {};
        const contentDetails = item.contentDetails || {};

        return {
            success: true,
            data: {
                externalId: videoId,
                kind: 'video',
                title: snippet.title || 'YouTube Video',
                description: snippet.description || '',
                channelOrOwner: snippet.channelTitle || 'YouTube',
                url: `https://www.youtube.com/watch?v=${videoId}`,
                thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || 'https://via.placeholder.com/400x225',
                duration: contentDetails.duration,
                publishedAt: snippet.publishedAt
            }
        };
    } catch (error) {
        const status = error.response?.status;
        if (status === 403 || status === 429) {
            return { success: false, rateLimited: true, status: "service_busy" };
        }
        return { success: false, error: error.message };
    }
}

/**
 * Fetch playlists for topic pages.
 */
async function fetchYoutubePlaylists(topicName, slug, parentSlug = null) {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    if (!API_KEY) {
        console.warn("YouTube API key not provided.");
        return [];
    }

    const assignedTopics = [slug];
    if (parentSlug && !assignedTopics.includes(parentSlug)) {
        assignedTopics.push(parentSlug);
    }

    const results = [];

    try {
        const playlistSearch = await axios.get(`${BASE_URL}/search`, {
            params: {
                part: 'snippet',
                q: `${topicName} full course`,
                type: 'playlist',
                maxResults: 15,
                order: 'viewCount',
                regionCode: 'IN',
                key: API_KEY
            },
            timeout: 8000
        });

        const playlistItems = playlistSearch.data?.items || [];
        const playlistIds = playlistItems.map(i => i.id?.playlistId).filter(Boolean).join(',');

        if (playlistIds) {
            const playlistDetails = await axios.get(`${BASE_URL}/playlists`, {
                params: {
                    part: 'snippet,contentDetails',
                    id: playlistIds,
                    key: API_KEY
                },
                timeout: 8000
            });

            const details = playlistDetails.data?.items || [];
            for (const item of details) {
                const externalId = item.id;
                results.push({
                    type: 'course',
                    kind: 'playlist',
                    platform: 'YouTube',
                    provider: item.snippet?.channelTitle || 'YouTube',
                    channelOrOwner: item.snippet?.channelTitle || 'YouTube',
                    title: item.snippet?.title || `${topicName} Course`,
                    description: item.snippet?.description || '',
                    link: `https://www.youtube.com/playlist?list=${externalId}`,
                    url: `https://www.youtube.com/playlist?list=${externalId}`,
                    imageUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || 'https://via.placeholder.com/400x225',
                    thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || 'https://via.placeholder.com/400x225',
                    externalId: externalId,
                    topics: assignedTopics,
                    lectures: `${item.contentDetails?.itemCount || 0} videos`,
                    pricingType: 'free',
                    source: 'youtube-api',
                    meta: {
                        playlistId: externalId,
                        itemCount: item.contentDetails?.itemCount,
                        publishedAt: item.snippet?.publishedAt
                    },
                    status: 'approved',
                    roomId: `course:${externalId}`,
                    level: 'intermediate'
                });
            }
        }
    } catch (error) {
        const errorMsg = error.response?.data?.error?.message || error.message;
        if (errorMsg.includes('quota') || error.response?.status === 403) {
            console.warn("YouTube API quota exceeded or forbidden.");
        } else {
            console.error("Error fetching YouTube playlists:", errorMsg);
        }
    }

    return results;
}

module.exports = {
    getYoutubePlaylistById,
    getYoutubeVideoById,
    fetchYoutubePlaylists
};
