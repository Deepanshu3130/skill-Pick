const axios = require('axios');
const ApiCache = require('../model/apiCache');
require('dotenv').config();

/**
 * Searches the web using Brave Search API, cached in MongoDB for 24 hours.
 * Returns up to `count` results formatted as { index, title, url, domain, snippet }.
 */
async function searchWeb(query, count = 8) {
    const rawQuery = (query || '').trim();
    if (!rawQuery) {
        return { success: true, results: [] };
    }

    const normalizedQuery = rawQuery.toLowerCase().replace(/\s+/g, ' ');
    const cacheKey = `brave:${normalizedQuery}`;

    // 1. Check MongoDB TTL Cache
    try {
        const cached = await ApiCache.findOne({ key: cacheKey });
        if (cached && cached.data) {
            return { success: true, results: cached.data, cached: true };
        }
    } catch (cacheErr) {
        console.warn("MongoDB cache lookup failed in webSearch:", cacheErr.message);
    }

    // 2. Query Brave Search API
    const apiKey = process.env.BRAVE_API_KEY || process.env.BRAVE_SEARCH_API_KEY;
    if (!apiKey || apiKey.includes('your_brave')) {
        console.warn("Brave Search API key not configured.");
        return { success: false, status: "service_busy", results: [] };
    }

    try {
        const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
            params: {
                q: rawQuery,
                count: count
            },
            headers: {
                'Accept': 'application/json',
                'X-Subscription-Token': apiKey.trim()
            },
            timeout: 5000
        });

        const rawResults = response.data?.web?.results || [];
        const formattedResults = rawResults.slice(0, count).map((item, idx) => {
            let domain = '';
            try {
                domain = new URL(item.url).hostname.replace(/^www\./, '');
            } catch (e) {
                domain = '';
            }

            return {
                index: idx,
                title: item.title || '',
                url: item.url || '',
                domain: domain,
                snippet: item.description || ''
            };
        });

        // 3. Store in MongoDB Cache with 24-hour expiration
        try {
            await ApiCache.findOneAndUpdate(
                { key: cacheKey },
                {
                    key: cacheKey,
                    provider: 'brave',
                    data: formattedResults,
                    expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                },
                { upsert: true, new: true }
            );
        } catch (saveErr) {
            console.warn("Failed to save Brave search to MongoDB cache:", saveErr.message);
        }

        return { success: true, results: formattedResults };
    } catch (apiError) {
        const status = apiError.response?.status;
        console.error("Brave Search API error:", status, apiError.message);
        if (status === 429 || status === 403 || status === 503) {
            return { success: false, status: "service_busy", results: [] };
        }
        return { success: false, status: "service_busy", results: [] };
    }
}

module.exports = {
    searchWeb
};
