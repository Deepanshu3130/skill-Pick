// const axios = require('axios');
// require('dotenv').config();
// //const cors = require('cors');

// const youtubeCourses = async (query ,minHours = 2)=>{
//     const API_KEY = process.env.YOUTUBE_API_KEY;
//     const BASE_URL = "https://www.googleapis.com/youtube/v3";
    
       
//     if (!API_KEY) {
//         console.error("API Key is missing. Check your .env file.");
//         return;
//     }
//     try{
        
//         const response = await axios.get(`${BASE_URL}/search`, {
//             params: {
//                 part: 'snippet',
//                 q: query + "course",
//                 type: 'video',
//                 videoDuration: 'long', // Only long videos (likely full courses)
//                 maxResults: 15,
//                 order: 'viewCount', // Sort by most popular
//                 regionCode: 'IN', // Prioritize Indian content
//                 key: API_KEY
//             }
//         });

//         // Extract video IDs from search results
//         const videoIds = response.data.items.map(item => item.id.videoId).join(',');

//         if (!videoIds) {
//             console.log("No videos found.");
//             return;
//         }

//         // Step 2: Fetch detailed video data to check durations
//         const videoDetailsResponse = await axios.get(`${BASE_URL}/videos`, {
//             params: {
//                 part: 'snippet,contentDetails',
//                 id: videoIds,
//                 key: API_KEY
//             }
//         });

//         // Function to convert ISO 8601 duration to hours
//         const parseDuration = (isoDuration) => {
//             const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
//             const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
//             const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
//             return hours + minutes / 60; // Convert to total hours
//         };
//         const filteredVideos = videoDetailsResponse.data.items
//         .filter(video => parseDuration(video.contentDetails.duration) >= minHours)
//         .map(video => ({
//             type: 'Video',
//             title: video.snippet.title,
//             channel: video.snippet.channelTitle,
//             videoId: video.id,
//             duration: video.contentDetails.duration, // ISO format
//             thumbnail: video.snippet.thumbnails.high.url,
//             url: `https://www.youtube.com/watch?v=${video.id}`
//         }));

//         // const videos = response.data.items.map(item => ({
//         //     title: item.snippet.title,
//         //     channel: item.snippet.channelTitle,
//         //     videoId: item.id.videoId,
//         //     thumbnail: item.snippet.thumbnails.high.url,
//         //     url: item.id.kind.includes('playlist') 
//         //         ? `https://www.youtube.com/playlist?list=${item.id.playlistId}` 
//         //         : `https://www.youtube.com/watch?v=${item.id.videoId}`
//         // }));
//        // console.log('Extracted Course Data:', JSON.stringify(videos, null, 2));

//         // Step 3: Fetch playlists separately
//         const playlistResponse = await axios.get(`${BASE_URL}/search`, {
//             params: {
//                 part: 'snippet',
//                 q: query + " course",
//                 type: 'playlist',
//                 maxResults: 15,
//                 order: 'viewCount',
//                 regionCode: 'IN',
//                 relevanceLanguage: 'en',
//                 key: API_KEY
//             }
//         });

//         // Extract playlist data
//         const playlists = playlistResponse.data.items.map(item => ({
//             type: 'Playlist',
//             title: item.snippet.title,
//             channel: item.snippet.channelTitle,
//             playlistId: item.id.playlistId,
//             thumbnail: item.snippet.thumbnails.high.url,
//             url: `https://www.youtube.com/playlist?list=${item.id.playlistId}`
//         }));

//         // Combine filtered videos and playlists
//         const results = [...filteredVideos, ...playlists];

//         console.log('Filtered Course Data:', JSON.stringify(results, null, 2));
//         //return results;

//     }catch (error) {
//         console.error("Error fetching data:", error);

//     }
// }
// const query1 = 'web development';
// const minHours = 2;
// youtubeCourses(query1,minHours)
//   .then(() => console.log('Scraping completed!'))
//   .catch((err) => console.error('Error during scraping:', err.message));

const axios = require('axios');
require('dotenv').config();

exports.youtubeCourses = async(query)=>{
    
const youtubeVideos = async (query, minHours = 2) => {

    
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const BASE_URL = "https://www.googleapis.com/youtube/v3";
    
    if (!API_KEY) {
        throw new Error("API Key is missing");
    }

    try {
        // 1. Search for videos
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

        // Handle empty results
        if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
            return { videos: [], playlists: [] };
        }

        // 2. Get video details
        const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');
        const detailsResponse = await axios.get(`${BASE_URL}/videos`, {
            params: {
                part: 'contentDetails,snippet',
                id: videoIds,
                key: API_KEY
            }
        });

        // 3. Parse durations correctly
        const parseDuration = (isoDuration) => {
            const hoursMatch = isoDuration.match(/(\d+)H/);
            const minutesMatch = isoDuration.match(/(\d+)M/);
            return (parseInt(hoursMatch?.[1] || 0)) + 
                   (parseInt(minutesMatch?.[1] || 0) / 60);
        };

        // 4. Filter and format videos
        const filteredVideos = detailsResponse.data.items
            .filter(video => parseDuration(video.contentDetails.duration) >= minHours)
            .map(video => ({
                platform : 'YouTube',
                type: 'free',
                title: video.snippet.title,
                level: `intermediate`,
                provider: video.snippet.channelTitle,
                description: video.snippet.channelTitle,
                id: video.id,
                duration: "Appox "+ Math.floor(parseDuration(video.contentDetails.duration)) + 'hours',
                imageUrl: video.snippet.thumbnails.high.url,
                //views: video.statistics?.viewCount || 'coming soon ', 
                //comments : video.statistics?.commentCount || 'coming soon',
                link: `https://www.youtube.com/watch?v=${video.id}`
            }));
            return filteredVideos;
        }
            catch (error) {
                console.error("API Error:", error.response?.data?.error || error.message);
                throw new Error("Failed to fetch YouTube videos");
            }

            // function to count total no. of videos in playlist  {*** see this ***}
            // const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            // const countVideos = async (playlistId) => {
            //     let totalVideos = 0;
            //     let nextPageToken = null;
            //     do{
                    
            //         const response = await axios.get(`${BASE_URL}/playlistItems`, {
            //             params: {
            //                 part: 'snippet',
            //                 playlistId: playlistId,
            //                 maxResults: 10,
            //                 pageToken: nextPageToken,
            //                 key: API_KEY
            //             }
            //         });
            //         totalVideos += response.data.items.length;
            //         nextPageToken = response.data.nextPageToken;
            //         await delay(1000);
            //     }while(nextPageToken);
            //     return totalVideos;
            // }
        // 5. Search for playlists
}

const youtubePlaylists = async (query) => {
    function convertDate(date){
        const dateObj = new Date(date);
        const readableDate = dateObj.toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: true 
        });
        return readableDate;

    }
    const API_KEY = process.env.YOUTUBE_API_KEY;
    console.log(API_KEY);
    if (!API_KEY) {
        throw new Error("Missing YOUTUBE_API_KEY in .env file.");
    }

    const BASE_URL = "https://www.googleapis.com/youtube/v3";
    const BASE_URL1 = "https://www.googleapis.com/youtube/v3/playlists";

    try {
        // Fetch playlists from search query
        const playlistResponse = await axios.get(`${BASE_URL}/search`, {
            params: {
                part: 'snippet',
                q: `${query} playlist`,
                type: 'playlist',
                maxResults: 30,
                order: 'viewCount',
                regionCode: 'IN',
                key: API_KEY
            }
        });

        if (!playlistResponse.data.items || playlistResponse.data.items.length === 0) {
            throw new Error('No playlists found.');
        }

        // Extract playlist IDs
        const playlistIds = playlistResponse.data.items
            .map(item => item.id.playlistId)
            .filter(id => id) // Ensure no null values
            .join(',');

        if (!playlistIds) {
            throw new Error('No valid playlist IDs found.');
        }

        // Fetch detailed playlist info
        const response = await axios.get(BASE_URL1, {
            params: {
                part: 'snippet,contentDetails',
                id: playlistIds,
                key: API_KEY
            }
        });

        if (!response.data.items || response.data.items.length === 0) {
            throw new Error('No detailed playlist data found.');
        }

        return response.data.items.map(playlist => ({
            platform: 'YouTube',
            type: 'free',
            title: playlist.snippet.title,
            provider: playlist.snippet.channelTitle,
            description: playlist.snippet.description,
            lectures: playlist.contentDetails.itemCount,
            createdAt: convertDate(playlist.snippet.publishedAt),
            link: `https://www.youtube.com/playlist?list=${playlist.id}`,
            imageUrl: playlist?.snippet?.thumbnails?.high?.url || 'https://via.placeholder.com/150',
            level: 'intermediate',
        }));

    } catch (error) {
        console.error("API Error:", error.response?.data?.error || error.message);
        return null;
    }
};

// Example Usage
const result1=await youtubePlaylists(query)
    // .then(results => console.log('Final Results:', JSON.stringify(results, null, 2)))
    // .catch(err => console.error('Error:', err.message));


const result2=await youtubeVideos(query, 2)
    // .then(results => {
    //     console.log('Final Results:', JSON.stringify(results, null, 2));
    // })
    // .catch(err => {
    //     console.error('Error:', err.message);
    // });
    //console.log([...result1,...result2]);
    return [...result1,...result2];

  
}
 ///youtubeCourses("artificial intelligence");
