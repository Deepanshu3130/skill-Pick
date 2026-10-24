const axios = require('axios');
const ApiCache = require('../model/apiCache');
require('dotenv').config();

function getGithubHeaders() {
    const token = process.env.GITHUB_TOKEN;
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'SkillPick-App'
    };

    if (token && token.trim() && !token.includes('your_github')) {
        headers['Authorization'] = `token ${token.trim()}`;
    }
    return headers;
}

/**
 * Fetch a single repository by owner and repo name.
 */
async function getGithubRepo(owner, repo) {
    const fullName = `${owner}/${repo}`;
    try {
        const response = await axios.get(`https://api.github.com/repos/${fullName}`, {
            headers: getGithubHeaders(),
            timeout: 5000
        });
        return { success: true, data: response.data };
    } catch (error) {
        const status = error.response?.status;
        if (status === 404) {
            return { success: false, notFound: true };
        }
        if (status === 403 || status === 429) {
            return { success: false, rateLimited: true };
        }
        return { success: false, error: error.message };
    }
}

/**
 * Searches repositories on GitHub with 1-hour MongoDB TTL caching.
 */
async function searchGithubRepos(query, perPage = 8) {
    const rawQuery = (query || '').trim();
    if (!rawQuery) {
        return { success: true, results: [] };
    }

    const normalizedQuery = rawQuery.toLowerCase().replace(/\s+/g, ' ');
    const cacheKey = `github:${normalizedQuery}`;

    // 1. Check MongoDB TTL Cache
    try {
        const cached = await ApiCache.findOne({ key: cacheKey });
        if (cached && cached.data) {
            return { success: true, results: cached.data, cached: true };
        }
    } catch (cacheErr) {
        console.warn("MongoDB cache lookup failed in searchGithubRepos:", cacheErr.message);
    }

    // 2. Fetch from GitHub Search API
    try {
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(rawQuery)}&sort=stars&per_page=${perPage}`;
        const response = await axios.get(url, {
            headers: getGithubHeaders(),
            timeout: 8000
        });

        const items = response.data?.items || [];
        const formattedResults = items.slice(0, perPage).map((repo, idx) => ({
            index: idx,
            fullName: repo.full_name,
            title: repo.full_name,
            description: repo.description || '',
            stars: repo.stargazers_count,
            language: repo.language || 'Unknown',
            ownerAvatar: repo.owner?.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
            url: repo.html_url,
            domain: 'github.com',
            snippet: repo.description || ''
        }));

        // 3. Store in MongoDB Cache with 1-hour TTL
        try {
            await ApiCache.findOneAndUpdate(
                { key: cacheKey },
                {
                    key: cacheKey,
                    provider: 'github',
                    data: formattedResults,
                    expireAt: new Date(Date.now() + 60 * 60 * 1000)
                },
                { upsert: true, new: true }
            );
        } catch (saveErr) {
            console.warn("Failed to save GitHub search to MongoDB cache:", saveErr.message);
        }

        return { success: true, results: formattedResults };
    } catch (error) {
        const status = error.response?.status;
        console.error("GitHub Search API error:", status, error.message);
        if (status === 403 || status === 429) {
            return { success: false, status: "service_busy", results: [] };
        }
        return { success: false, status: "service_busy", results: [] };
    }
}

/**
 * Fetch top repositories by topic for topic resource pages.
 */
async function fetchGithubRepos(slug, parentSlug = null) {
    try {
        const queryTerm = `topic:${slug}`;
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(queryTerm)}&sort=stars&order=desc&per_page=15`;

        const response = await axios.get(url, {
            headers: getGithubHeaders(),
            timeout: 8000
        });
        const items = response.data?.items || [];

        const assignedTopics = [slug];
        if (parentSlug && !assignedTopics.includes(parentSlug)) {
            assignedTopics.push(parentSlug);
        }

        return items.map(repo => {
            const externalId = repo.full_name.toLowerCase();
            return {
                type: 'repo',
                platform: 'GitHub',
                provider: repo.owner?.login || 'GitHub',
                channelOrOwner: repo.owner?.login || 'GitHub',
                title: repo.name,
                description: repo.description || `Popular GitHub repository for ${slug}`,
                link: repo.html_url,
                url: repo.html_url,
                imageUrl: repo.owner?.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
                thumbnail: repo.owner?.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
                externalId: externalId,
                topics: assignedTopics,
                meta: {
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    language: repo.language || 'Unknown',
                    openIssues: repo.open_issues_count,
                    updatedAt: repo.updated_at
                },
                status: 'approved',
                roomId: `repo:${externalId}`,
                level: 'intermediate'
            };
        });
    } catch (error) {
        if (error.response?.status === 403 || error.response?.status === 429) {
            console.warn("GitHub rate limit reached while fetching repos:", error.response?.data?.message || error.message);
        } else {
            console.error("Error fetching GitHub repos:", error.message);
        }
        return [];
    }
}

module.exports = {
    getGithubRepo,
    searchGithubRepos,
    fetchGithubRepos
};
