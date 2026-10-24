const crypto = require('crypto');
const courseDetail = require('../model/courseDetail');
const Topic = require('../model/topic');
const PickSession = require('../model/pickSession');
const UserActivity = require('../model/userActivity');
const { validateUrlForSsrf, normalizeUrl } = require('../utils/ssrfValidator');
const { searchWeb } = require('../services/webSearch');
const { getGithubRepo, searchGithubRepos } = require('../services/githubService');
const { getYoutubePlaylistById, getYoutubeVideoById } = require('../services/youtubeService');
const { tagResource } = require('../services/taggingService');

/**
 * Check if user exceeded 10 submissions in the last 24 hours.
 */
async function checkDailySubmissionLimit(userId) {
    if (!userId) return false;
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const count = await UserActivity.countDocuments({
        userId,
        type: 'submission',
        createdAt: { $gte: oneDayAgo }
    });
    return count >= 10;
}

/**
 * Record a submission for the daily limit.
 */
async function recordSubmission(userId) {
    if (!userId) return;
    await UserActivity.create({
        userId,
        type: 'submission',
        expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
}

/**
 * Check if user exceeded 20 GitHub searches in the last hour.
 */
async function checkGithubSearchLimit(userId) {
    if (!userId) return false;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const count = await UserActivity.countDocuments({
        userId,
        type: 'github-search',
        createdAt: { $gte: oneHourAgo }
    });
    return count >= 20;
}

/**
 * Record a GitHub search.
 */
async function recordGithubSearch(userId) {
    if (!userId) return;
    await UserActivity.create({
        userId,
        type: 'github-search',
        expireAt: new Date(Date.now() + 60 * 60 * 1000)
    });
}

/**
 * Extracts searchable slug words and domain from a URL (e.g., "complete web development bootcamp udemy")
 */
function buildSearchQueryFromUrl(parsedUrl) {
    const domain = parsedUrl.hostname.replace(/^www\./, '').split('.')[0] || '';
    const stopwords = ['course', 'courses', 'tutorial', 'tutorials', 'watch', 'video', 'the', 'a', 'an', 'in', 'for', 'to', 'and'];
    const pathWords = parsedUrl.pathname
        .split(/[\/\-_]/)
        .filter(w => w && w.length > 2 && !stopwords.includes(w.toLowerCase()));
    
    const words = [...pathWords.slice(0, 5), domain].filter(Boolean);
    return words.join(' ').trim() || `${domain} course`;
}

/**
 * POST /api/resources/from-link
 * Requires login. 10/day limit on save.
 */
exports.addFromLink = async (req, res) => {
    try {
        const { url, topicSlug } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ status: "unauthorized", message: "Please log in to add a course." });
        }

        if (!url || typeof url !== 'string' || url.length > 500) {
            return res.status(400).json({
                status: "invalid",
                message: "That doesn't look like a valid link. Please paste the full URL starting with https://"
            });
        }

        // 1. Validate URL & SSRF
        let parsedUrl;
        try {
            parsedUrl = await validateUrlForSsrf(url.trim());
        } catch {
            return res.status(400).json({
                status: "invalid",
                message: "That doesn't look like a valid link. Please paste the full URL starting with https://"
            });
        }

        const normalized = normalizeUrl(parsedUrl.toString());
        const targetTopic = (topicSlug || 'web-development').toLowerCase().trim();

        // 2. Compute externalId offline WITHOUT API call
        let type = 'course';
        let kind = null;
        let externalId = null;

        const hostname = parsedUrl.hostname.toLowerCase().replace(/^www\./, '');

        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
            type = 'course';
            if (parsedUrl.searchParams.has('list')) {
                kind = 'playlist';
                externalId = parsedUrl.searchParams.get('list');
            } else if (parsedUrl.hostname.includes('youtu.be')) {
                kind = 'video';
                externalId = parsedUrl.pathname.slice(1).split('/')[0];
            } else if (parsedUrl.searchParams.has('v')) {
                kind = 'video';
                externalId = parsedUrl.searchParams.get('v');
            }
        } else if (hostname.includes('github.com')) {
            type = 'repo';
            const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
            if (pathParts.length >= 2) {
                externalId = `${pathParts[0]}/${pathParts[1]}`.toLowerCase();
            }
        }

        if (!externalId) {
            type = 'course';
            kind = null;
            externalId = normalized;
        }

        // 3. DUPLICATE CHECK before any API call
        const escapedExternalId = externalId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const existing = await courseDetail.findOne({
            $or: [
                { type, externalId: new RegExp('^' + escapedExternalId + '$', 'i') },
                { url: normalized },
                { link: normalized }
            ]
        });

        if (existing) {
            return res.status(200).json({
                status: "exists",
                message: type === 'repo' ? "This repo is already here. Join its room below." : "This one is already here. Join its room below.",
                resource: existing
            });
        }

        // 4. Check daily submission limit before saving
        if (await checkDailySubmissionLimit(userId)) {
            return res.status(429).json({
                status: "rate_limited",
                message: "You've reached today's limit of 10 submissions. Try again tomorrow."
            });
        }

        // Retrieve topic info for parent tagging
        const currentTopicDoc = await Topic.findOne({ slug: targetTopic }).lean();
        const parentSlug = currentTopicDoc?.parent || null;

        // 5. YouTube API Flow (Approved)
        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
            let ytResult;
            if (kind === 'playlist') {
                ytResult = await getYoutubePlaylistById(externalId);
            } else {
                ytResult = await getYoutubeVideoById(externalId);
            }

            if (!ytResult.success) {
                if (ytResult.rateLimited) {
                    return res.status(503).json({ status: "service_busy", message: "We're a bit busy right now. Please try again in a few minutes." });
                }
                return res.status(400).json({ status: "invalid", message: "YouTube video or playlist not found." });
            }

            const data = ytResult.data;
            const tags = await tagResource({ title: data.title, description: data.description }, targetTopic, parentSlug);

            const newResource = new courseDetail({
                type: 'course',
                kind: kind,
                platform: 'YouTube',
                provider: data.channelOrOwner,
                channelOrOwner: data.channelOrOwner,
                title: data.title,
                description: data.description,
                url: data.url,
                link: data.url,
                imageUrl: data.thumbnail,
                thumbnail: data.thumbnail,
                externalId: externalId,
                topics: tags,
                status: 'approved',
                source: 'youtube-api',
                addedBy: userId,
                roomId: `course:${externalId}`,
                meta: { videoCount: data.videoCount, publishedAt: data.publishedAt },
                level: 'intermediate',
                pricingType: 'free'
            });

            try {
                await newResource.save();
                await recordSubmission(userId);
                return res.status(201).json({
                    status: "added",
                    message: "Added! Your resource is now live.",
                    resource: newResource
                });
            } catch (err) {
                if (err.code === 11000) {
                    const dup = await courseDetail.findOne({ type: 'course', externalId });
                    return res.status(200).json({ status: "exists", message: "This one is already here. Join its room below.", resource: dup });
                }
                throw err;
            }
        }

        // 6. GitHub API Flow (Approved)
        if (hostname.includes('github.com')) {
            const [owner, repo] = externalId.split('/');
            const ghResult = await getGithubRepo(owner, repo);

            if (!ghResult.success) {
                if (ghResult.rateLimited) {
                    return res.status(503).json({ status: "service_busy", message: "We're a bit busy right now. Please try again in a few minutes." });
                }
                return res.status(400).json({ status: "invalid", message: "GitHub repository not found." });
            }

            const data = ghResult.data;
            const tags = await tagResource({ title: data.name, description: data.description }, targetTopic, parentSlug);

            const newResource = new courseDetail({
                type: 'repo',
                platform: 'GitHub',
                provider: data.owner?.login || owner,
                channelOrOwner: data.owner?.login || owner,
                title: data.name,
                description: data.description || `GitHub Repository: ${externalId}`,
                url: data.html_url,
                link: data.html_url,
                imageUrl: data.owner?.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
                thumbnail: data.owner?.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
                externalId: externalId,
                topics: tags,
                status: 'approved',
                source: 'github-api',
                addedBy: userId,
                roomId: `repo:${externalId}`,
                meta: {
                    stars: data.stargazers_count,
                    forks: data.forks_count,
                    language: data.language || 'Unknown'
                },
                level: 'intermediate',
                pricingType: 'free'
            });

            try {
                await newResource.save();
                await recordSubmission(userId);
                return res.status(201).json({
                    status: "added",
                    message: "Added! The repo is now live.",
                    resource: newResource
                });
            } catch (err) {
                if (err.code === 11000) {
                    const dup = await courseDetail.findOne({ type: 'repo', externalId });
                    return res.status(200).json({ status: "exists", message: "This repo is already here. Join its room below.", resource: dup });
                }
                throw err;
            }
        }

        // 7. Any other link (Udemy, Coursera, etc.) -> Brave Search Picker (NO HTML PAGE FETCHING)
        const generatedQuery = buildSearchQueryFromUrl(parsedUrl);
        const searchRes = await searchWeb(generatedQuery, 8);

        if (!searchRes.success && searchRes.status === "service_busy") {
            return res.status(503).json({ status: "service_busy", message: "We're a bit busy right now. Please try again in a few minutes." });
        }

        const results = searchRes.results || [];

        // AUTO-MATCH: If one result's normalized URL equals the pasted normalized URL
        const autoMatch = results.find(r => normalizeUrl(r.url) === normalized);
        if (autoMatch) {
            const tags = await tagResource({ title: autoMatch.title, description: autoMatch.snippet }, targetTopic, parentSlug);

            const newResource = new courseDetail({
                type: 'course',
                platform: autoMatch.domain || hostname,
                provider: autoMatch.domain || hostname,
                channelOrOwner: autoMatch.domain || hostname,
                title: autoMatch.title,
                description: autoMatch.snippet,
                url: normalized,
                link: normalized,
                imageUrl: 'https://via.placeholder.com/400x225',
                thumbnail: 'https://via.placeholder.com/400x225',
                externalId: normalized,
                topics: tags,
                status: 'pending',
                source: 'search',
                addedBy: userId,
                upvotes: [userId],
                reports: [],
                roomId: `course:${normalized}`,
                meta: { originalUrl: normalized },
                level: 'intermediate',
                pricingType: 'paid'
            });

            try {
                await newResource.save();
                await recordSubmission(userId);
                return res.status(201).json({
                    status: "added",
                    message: "Thanks! Your resource is visible to you now and will go public after 3 upvotes.",
                    resource: newResource
                });
            } catch (err) {
                if (err.code === 11000) {
                    const dup = await courseDetail.findOne({ type: 'course', externalId: normalized });
                    return res.status(200).json({ status: "exists", message: "This one is already here. Join its room below.", resource: dup });
                }
                throw err;
            }
        }

        // Otherwise create PickSession (10 min TTL) and return choose status
        const searchId = crypto.randomUUID();
        await PickSession.create({
            searchId,
            userId,
            query: generatedQuery,
            topicSlug: targetTopic,
            type: 'course',
            results: results
        });

        return res.status(200).json({
            status: "choose",
            searchId,
            query: generatedQuery,
            results: results.map(r => ({
                index: r.index,
                title: r.title,
                domain: r.domain,
                snippet: r.snippet
            }))
        });

    } catch (error) {
        console.error("Error in addFromLink:", error);
        return res.status(500).json({ status: "service_busy", message: "We're a bit busy right now. Please try again in a few minutes." });
    }
};

/**
 * POST /api/resources/search (and aliased /search-web)
 * Queries Brave only, results stored in PickSession, returns status "choose".
 */
exports.searchResources = async (req, res) => {
    try {
        const { query, topicSlug } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ status: "unauthorized", message: "Please log in to add a course." });
        }

        if (!query || typeof query !== 'string') {
            return res.status(400).json({ status: "invalid", message: "Search query is required." });
        }

        const targetTopic = (topicSlug || 'web-development').toLowerCase().trim();
        const searchRes = await searchWeb(query.trim(), 8);

        if (!searchRes.success && searchRes.status === "service_busy") {
            return res.status(503).json({ status: "service_busy", message: "We're a bit busy right now. Please try again in a few minutes." });
        }

        const results = searchRes.results || [];
        const searchId = crypto.randomUUID();

        await PickSession.create({
            searchId,
            userId,
            query: query.trim(),
            topicSlug: targetTopic,
            type: 'course',
            results: results
        });

        return res.status(200).json({
            status: "choose",
            searchId,
            query: query.trim(),
            results: results.map(r => ({
                index: r.index,
                title: r.title,
                domain: r.domain,
                snippet: r.snippet
            }))
        });
    } catch (error) {
        console.error("Error in searchResources:", error);
        return res.status(500).json({ status: "service_busy", message: "We're a bit busy right now. Please try again in a few minutes." });
    }
};

/**
 * POST /api/resources/pick
 * User selects a search result from PickSession.
 */
exports.pickResource = async (req, res) => {
    try {
        const { searchId, index } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ status: "unauthorized", message: "Please log in to add a course." });
        }

        if (!searchId || index === undefined || index === null) {
            return res.status(400).json({ status: "invalid", message: "searchId and index are required." });
        }

        // Verify session belongs to this user and has not expired
        const session = await PickSession.findOne({ searchId, userId });
        if (!session) {
            return res.status(400).json({ status: "invalid", message: "Invalid or expired search session." });
        }

        const item = session.results.find(r => r.index === Number(index));
        if (!item) {
            return res.status(400).json({ status: "invalid", message: "Selected item index is out of range." });
        }

        // Validate URL & normalize
        let parsedUrl;
        try {
            parsedUrl = await validateUrlForSsrf(item.url);
        } catch {
            return res.status(400).json({ status: "invalid", message: "Invalid URL in result." });
        }

        const normalized = normalizeUrl(parsedUrl.toString());
        const targetTopic = session.topicSlug;

        // Compute externalId
        let type = 'course';
        let externalId = normalized;
        const hostname = parsedUrl.hostname.toLowerCase().replace(/^www\./, '');

        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
            if (parsedUrl.searchParams.has('list')) {
                externalId = parsedUrl.searchParams.get('list');
            } else if (parsedUrl.searchParams.has('v')) {
                externalId = parsedUrl.searchParams.get('v');
            }
        } else if (hostname.includes('github.com')) {
            type = 'repo';
            const parts = parsedUrl.pathname.split('/').filter(Boolean);
            if (parts.length >= 2) {
                externalId = `${parts[0]}/${parts[1]}`.toLowerCase();
            }
        }

        // Duplicate check
        const escapedId = externalId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const existing = await courseDetail.findOne({
            $or: [
                { type, externalId: new RegExp('^' + escapedId + '$', 'i') },
                { url: normalized },
                { link: normalized }
            ]
        });

        if (existing) {
            return res.status(200).json({
                status: "exists",
                message: type === 'repo' ? "This repo is already here. Join its room below." : "This one is already here. Join its room below.",
                resource: existing
            });
        }

        // Check daily submission limit
        if (await checkDailySubmissionLimit(userId)) {
            return res.status(429).json({
                status: "rate_limited",
                message: "You've reached today's limit of 10 submissions. Try again tomorrow."
            });
        }

        const currentTopicDoc = await Topic.findOne({ slug: targetTopic }).lean();
        const parentSlug = currentTopicDoc?.parent || null;
        const tags = await tagResource({ title: item.title, description: item.snippet }, targetTopic, parentSlug);

        // YouTube verified API flow if picked URL was YouTube
        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
            const isPlaylist = parsedUrl.searchParams.has('list');
            const ytRes = isPlaylist ? await getYoutubePlaylistById(externalId) : await getYoutubeVideoById(externalId);
            if (ytRes.success) {
                const data = ytRes.data;
                const newRes = new courseDetail({
                    type: 'course',
                    kind: isPlaylist ? 'playlist' : 'video',
                    platform: 'YouTube',
                    provider: data.channelOrOwner,
                    channelOrOwner: data.channelOrOwner,
                    title: data.title,
                    description: data.description,
                    url: data.url,
                    link: data.url,
                    imageUrl: data.thumbnail,
                    thumbnail: data.thumbnail,
                    externalId: externalId,
                    topics: tags,
                    status: 'approved',
                    source: 'youtube-api',
                    addedBy: userId,
                    roomId: `course:${externalId}`,
                    level: 'intermediate',
                    pricingType: 'free'
                });
                await newRes.save();
                await recordSubmission(userId);
                return res.status(201).json({
                    status: "added",
                    message: "Added! Your resource is now live.",
                    resource: newRes
                });
            }
        }

        // Otherwise save as pending with source search-picked
        const newResource = new courseDetail({
            type: 'course',
            platform: item.domain || hostname,
            provider: item.domain || hostname,
            channelOrOwner: item.domain || hostname,
            title: item.title,
            description: item.snippet,
            url: normalized,
            link: normalized,
            imageUrl: 'https://via.placeholder.com/400x225',
            thumbnail: 'https://via.placeholder.com/400x225',
            externalId: externalId,
            topics: tags,
            status: 'pending',
            source: 'search-picked',
            addedBy: userId,
            upvotes: [userId],
            reports: [],
            roomId: `course:${externalId}`,
            level: 'intermediate',
            pricingType: 'paid'
        });

        try {
            await newResource.save();
            await recordSubmission(userId);
            return res.status(201).json({
                status: "added",
                message: "Thanks! Your resource is visible to you now and will go public after 3 upvotes.",
                resource: newResource
            });
        } catch (err) {
            if (err.code === 11000) {
                const dup = await courseDetail.findOne({ type: 'course', externalId });
                return res.status(200).json({ status: "exists", message: "This one is already here. Join its room below.", resource: dup });
            }
            throw err;
        }

    } catch (error) {
        console.error("Error in pickResource:", error);
        return res.status(500).json({ status: "service_busy", message: "We're a bit busy right now. Please try again in a few minutes." });
    }
};

/**
 * POST /api/resources/github-search
 * Search GitHub repos or validate a pasted github.com URL.
 * 20 searches/hour per user.
 */
exports.searchGithub = async (req, res) => {
    try {
        const { query, topicSlug } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ status: "unauthorized", message: "Please log in to add a course." });
        }

        if (!query || typeof query !== 'string') {
            return res.status(400).json({ status: "invalid", message: "Query is required." });
        }

        // Rate limit: 20 searches/hour per user
        if (await checkGithubSearchLimit(userId)) {
            return res.status(429).json({
                status: "rate_limited",
                message: "Search limit reached, try again later"
            });
        }

        await recordGithubSearch(userId);

        const raw = query.trim();
        const targetTopic = (topicSlug || 'web-development').toLowerCase().trim();

        // 1. If input is a github.com URL
        if (raw.includes('github.com')) {
            let parsed;
            try {
                parsed = await validateUrlForSsrf(raw.startsWith('http') ? raw : `https://${raw}`);
            } catch {
                return res.status(400).json({ status: "invalid", message: "Invalid GitHub URL." });
            }

            const parts = parsed.pathname.split('/').filter(Boolean);
            if (parts.length >= 2) {
                const owner = parts[0];
                const repo = parts[1];
                const externalId = `${owner}/${repo}`.toLowerCase();

                // Duplicate check
                const existing = await courseDetail.findOne({
                    type: 'repo',
                    externalId: new RegExp('^' + externalId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i')
                });
                if (existing) {
                    return res.status(200).json({
                        status: "exists",
                        message: "This repo is already here. Join its room below.",
                        resource: existing
                    });
                }

                const ghResult = await getGithubRepo(owner, repo);
                if (!ghResult.success) {
                    if (ghResult.rateLimited) {
                        return res.status(503).json({ status: "service_busy", message: "We're a bit busy right now. Please try again in a few minutes." });
                    }
                    return res.status(404).json({ status: "no_repos", message: "No repos found. Try different words or paste the repo link." });
                }

                const repoData = ghResult.data;
                const searchId = crypto.randomUUID();
                const singleResult = [{
                    index: 0,
                    fullName: repoData.full_name,
                    title: repoData.name,
                    description: repoData.description || '',
                    stars: repoData.stargazers_count,
                    language: repoData.language || 'Unknown',
                    ownerAvatar: repoData.owner?.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
                    url: repoData.html_url,
                    domain: 'github.com',
                    snippet: repoData.description || ''
                }];

                await PickSession.create({
                    searchId,
                    userId,
                    query: raw,
                    topicSlug: targetTopic,
                    type: 'repo',
                    results: singleResult
                });

                return res.status(200).json({
                    status: "choose",
                    searchId,
                    results: singleResult
                });
            }
        }

        // 2. Query GitHub Search API (Cached 1 hour)
        const ghSearch = await searchGithubRepos(raw, 8);
        if (!ghSearch.success && ghSearch.status === "service_busy") {
            return res.status(503).json({ status: "service_busy", message: "We're a bit busy right now. Please try again in a few minutes." });
        }

        const items = ghSearch.results || [];
        if (items.length === 0) {
            return res.status(200).json({
                status: "no_repos",
                message: "No repos found. Try different words or paste the repo link.",
                results: []
            });
        }

        const searchId = crypto.randomUUID();
        await PickSession.create({
            searchId,
            userId,
            query: raw,
            topicSlug: targetTopic,
            type: 'repo',
            results: items
        });

        return res.status(200).json({
            status: "choose",
            searchId,
            results: items
        });

    } catch (error) {
        console.error("Error in searchGithub:", error);
        return res.status(500).json({ status: "service_busy", message: "We're a bit busy right now. Please try again in a few minutes." });
    }
};

/**
 * POST /api/resources/pick-repo
 * User confirms/picks a repository from PickSession.
 */
exports.pickRepo = async (req, res) => {
    try {
        const { searchId, index } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ status: "unauthorized", message: "Please log in to add a course." });
        }

        if (!searchId || index === undefined || index === null) {
            return res.status(400).json({ status: "invalid", message: "searchId and index are required." });
        }

        const session = await PickSession.findOne({ searchId, userId });
        if (!session) {
            return res.status(400).json({ status: "invalid", message: "Invalid or expired search session." });
        }

        const item = session.results.find(r => r.index === Number(index));
        if (!item || !item.fullName) {
            return res.status(400).json({ status: "invalid", message: "Selected repo index is out of range." });
        }

        const externalId = item.fullName.toLowerCase();
        const targetTopic = session.topicSlug;

        // Duplicate check
        const existing = await courseDetail.findOne({
            type: 'repo',
            externalId: new RegExp('^' + externalId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i')
        });
        if (existing) {
            return res.status(200).json({
                status: "exists",
                message: "This repo is already here. Join its room below.",
                resource: existing
            });
        }

        // Daily submission limit check
        if (await checkDailySubmissionLimit(userId)) {
            return res.status(429).json({
                status: "rate_limited",
                message: "You've reached today's limit of 10 submissions. Try again tomorrow."
            });
        }

        const currentTopicDoc = await Topic.findOne({ slug: targetTopic }).lean();
        const parentSlug = currentTopicDoc?.parent || null;
        const tags = await tagResource({ title: item.fullName, description: item.description }, targetTopic, parentSlug);

        const [owner, name] = item.fullName.split('/');

        const newResource = new courseDetail({
            type: 'repo',
            platform: 'GitHub',
            provider: owner,
            channelOrOwner: owner,
            title: name || item.fullName,
            description: item.description || `GitHub Repository: ${item.fullName}`,
            url: item.url || `https://github.com/${item.fullName}`,
            link: item.url || `https://github.com/${item.fullName}`,
            thumbnail: item.ownerAvatar || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
            imageUrl: item.ownerAvatar || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
            externalId: externalId,
            topics: tags,
            status: 'approved',
            source: 'github-api',
            addedBy: userId,
            roomId: `repo:${externalId}`,
            meta: {
                stars: item.stars,
                language: item.language
            },
            level: 'intermediate',
            pricingType: 'free'
        });

        try {
            await newResource.save();
            await recordSubmission(userId);
            return res.status(201).json({
                status: "added",
                message: "Added! The repo is now live.",
                resource: newResource
            });
        } catch (err) {
            if (err.code === 11000) {
                const dup = await courseDetail.findOne({ type: 'repo', externalId });
                return res.status(200).json({ status: "exists", message: "This repo is already here. Join its room below.", resource: dup });
            }
            throw err;
        }

    } catch (error) {
        console.error("Error in pickRepo:", error);
        return res.status(500).json({ status: "service_busy", message: "We're a bit busy right now. Please try again in a few minutes." });
    }
};

/**
 * POST /api/resources/manual
 * Manual detail entry for "None of these, enter details manually"
 */
exports.addManual = async (req, res) => {
    try {
        const { url, title, description, topicSlug } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ status: "unauthorized", message: "Please log in to add a course." });
        }

        if (!title || !title.trim()) {
            return res.status(400).json({ status: "invalid", message: "Course title is required." });
        }

        if (!url || typeof url !== 'string') {
            return res.status(400).json({ status: "invalid", message: "Valid URL is required." });
        }

        let parsedUrl;
        try {
            parsedUrl = await validateUrlForSsrf(url.trim());
        } catch {
            return res.status(400).json({ status: "invalid", message: "That doesn't look like a valid link. Please paste the full URL starting with https://" });
        }

        const normalized = normalizeUrl(parsedUrl.toString());
        const targetTopic = (topicSlug || 'web-development').toLowerCase().trim();

        // Duplicate check
        const existing = await courseDetail.findOne({
            $or: [
                { type: 'course', externalId: normalized },
                { url: normalized },
                { link: normalized }
            ]
        });

        if (existing) {
            return res.status(200).json({
                status: "exists",
                message: "This one is already here. Join its room below.",
                resource: existing
            });
        }

        // Daily limit check
        if (await checkDailySubmissionLimit(userId)) {
            return res.status(429).json({
                status: "rate_limited",
                message: "You've reached today's limit of 10 submissions. Try again tomorrow."
            });
        }

        const currentTopicDoc = await Topic.findOne({ slug: targetTopic }).lean();
        const parentSlug = currentTopicDoc?.parent || null;
        const tags = await tagResource({ title: title.trim(), description: description || '' }, targetTopic, parentSlug);

        const domain = parsedUrl.hostname.replace(/^www\./, '');

        const newResource = new courseDetail({
            type: 'course',
            platform: domain,
            provider: domain,
            channelOrOwner: domain,
            title: title.trim().slice(0, 150),
            description: (description || '').trim().slice(0, 500),
            url: normalized,
            link: normalized,
            imageUrl: 'https://via.placeholder.com/400x225',
            thumbnail: 'https://via.placeholder.com/400x225',
            externalId: normalized,
            topics: tags,
            status: 'pending',
            source: 'manual',
            addedBy: userId,
            upvotes: [userId],
            reports: [],
            roomId: `course:${normalized}`,
            level: 'intermediate',
            pricingType: 'paid'
        });

        try {
            await newResource.save();
            await recordSubmission(userId);
            return res.status(201).json({
                status: "added",
                message: "Thanks! Your resource is visible to you now and will go public after 3 upvotes.",
                resource: newResource
            });
        } catch (err) {
            if (err.code === 11000) {
                const dup = await courseDetail.findOne({ type: 'course', externalId: normalized });
                return res.status(200).json({ status: "exists", message: "This one is already here. Join its room below.", resource: dup });
            }
            throw err;
        }

    } catch (error) {
        console.error("Error in addManual:", error);
        return res.status(500).json({ status: "service_busy", message: "We're a bit busy right now. Please try again in a few minutes." });
    }
};

/**
 * POST /api/resources/:id/upvote
 */
exports.upvoteResource = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ status: "unauthorized", message: "Please log in to upvote." });
        }

        const resource = await courseDetail.findById(id);
        if (!resource) {
            return res.status(404).json({ status: "invalid", message: "Resource not found" });
        }

        if (!resource.upvotes.includes(userId)) {
            resource.upvotes.push(userId);
            // Moderation: 3 upvotes converts pending to approved
            if (resource.status === 'pending' && resource.upvotes.length >= 3) {
                resource.status = 'approved';
            }
            await resource.save();
        }

        return res.status(200).json({
            status: "success",
            upvotesCount: resource.upvotes.length,
            resourceStatus: resource.status
        });
    } catch (error) {
        return res.status(500).json({ status: "service_busy", message: error.message });
    }
};

/**
 * POST /api/resources/:id/report
 */
exports.reportResource = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ status: "unauthorized", message: "Please log in to report." });
        }

        const resource = await courseDetail.findById(id);
        if (!resource) {
            return res.status(404).json({ status: "invalid", message: "Resource not found" });
        }

        if (!resource.reports.includes(userId)) {
            resource.reports.push(userId);
            if (resource.reports.length >= 3) {
                resource.status = 'rejected';
            }
            await resource.save();
        }

        return res.status(200).json({
            status: "success",
            reportsCount: resource.reports.length,
            resourceStatus: resource.status
        });
    } catch (error) {
        return res.status(500).json({ status: "service_busy", message: error.message });
    }
};
