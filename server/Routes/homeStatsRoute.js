const express = require('express');
const router = express.Router();
const Topic = require('../model/topic');
const courseDetail = require('../model/courseDetail');

// In-memory cache for 5 minutes (300,000 ms)
let cachedStats = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

// In-memory rate limiter: max 60 requests per minute per IP
const requestCounts = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 60;

function rateLimiter(req, res, next) {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const clientData = requestCounts.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

    if (now > clientData.resetTime) {
        clientData.count = 0;
        clientData.resetTime = now + RATE_LIMIT_WINDOW_MS;
    }

    clientData.count++;
    requestCounts.set(ip, clientData);

    if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later."
        });
    }
    next();
}

/**
 * GET /api/home-stats
 * Public read-only endpoint returning platform resource counts and top topics.
 */
router.get('/home-stats', rateLimiter, async (req, res) => {
    try {
        const now = Date.now();
        if (cachedStats && now < cacheExpiry) {
            return res.status(200).json(cachedStats);
        }

        const [topicsCount, coursesCount, reposCount, rooms] = await Promise.all([
            Topic.countDocuments(),
            courseDetail.countDocuments({ type: "course", status: "approved" }),
            courseDetail.countDocuments({ type: "repo", status: "approved" }),
            courseDetail.distinct("roomId", { status: "approved", roomId: { $ne: null } })
        ]);

        let popularTopics = await Topic.find({})
            .sort({ searchCount: -1, createdAt: -1 })
            .limit(12)
            .select('name slug -_id')
            .lean();

        if (!popularTopics || popularTopics.length === 0) {
            const distinctTopicSlugs = await courseDetail.distinct("topics", { status: "approved" });
            popularTopics = (distinctTopicSlugs || []).slice(0, 12).map(slug => ({
                name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                slug
            }));
        }

        cachedStats = {
            success: true,
            topics: topicsCount || 0,
            courses: coursesCount || 0,
            repos: reposCount || 0,
            rooms: rooms?.length || 0,
            popularTopics: (popularTopics || []).map(t => ({ name: t.name, slug: t.slug }))
        };
        cacheExpiry = now + CACHE_TTL_MS;

        return res.status(200).json(cachedStats);
    } catch (error) {
        console.error("Error in /api/home-stats:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch home statistics",
            error: error.message
        });
    }
});

module.exports = router;
