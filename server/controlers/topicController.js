const Topic = require('../model/topic');
const { getHierarchicalResources } = require('../services/resourceService');

exports.suggestTopics = async (req, res) => {
    try {
        const q = (req.query.q || '').trim();
        if (!q || q.length < 2) {
            return res.status(200).json({
                success: true,
                suggestions: []
            });
        }

        // Try MongoDB Atlas Search autocomplete first
        try {
            const pipeline = [
                {
                    $search: {
                        index: "topics_autocomplete",
                        compound: {
                            should: [
                                {
                                    autocomplete: {
                                        query: q,
                                        path: "name",
                                        fuzzy: {
                                            maxEdits: 1,
                                            prefixLength: 2
                                        }
                                    }
                                },
                                {
                                    autocomplete: {
                                        query: q,
                                        path: "aliases",
                                        fuzzy: {
                                            maxEdits: 1,
                                            prefixLength: 2
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    $limit: 6
                },
                {
                    $project: {
                        name: 1,
                        slug: 1,
                        aliases: 1,
                        parent: 1,
                        related: 1,
                        score: { $meta: "searchScore" }
                    }
                }
            ];

            const results = await Topic.aggregate(pipeline);
            if (results && results.length > 0) {
                return res.status(200).json({
                    success: true,
                    suggestions: results
                });
            }
        } catch (atlasSearchError) {
            // Fall back gracefully to case-insensitive regex matching
            console.warn("Atlas Search fallback triggered:", atlasSearchError.message);
        }

        // Fallback: regex search on name, slug, and aliases
        const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedQuery, 'i');

        const fallbackResults = await Topic.find({
            $or: [
                { name: regex },
                { slug: regex },
                { aliases: regex }
            ]
        })
        .select('name slug aliases parent related')
        .limit(6);

        return res.status(200).json({
            success: true,
            suggestions: fallbackResults
        });
    } catch (error) {
        console.error("Error in suggestTopics:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch suggestions",
            error: error.message
        });
    }
};

exports.getTopicBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const topic = await Topic.findOne({ slug: slug.toLowerCase() });
        if (!topic) {
            return res.status(404).json({
                success: false,
                message: "Topic not found"
            });
        }
        return res.status(200).json({
            success: true,
            topic
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

exports.getTopicResources = async (req, res) => {
    try {
        const { slug } = req.params;
        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Topic slug is required"
            });
        }
        const data = await getHierarchicalResources(slug, req.userId);
        return res.status(200).json({
            success: true,
            ...data
        });
    } catch (error) {
        console.error("Error in getTopicResources:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch topic resources",
            error: error.message
        });
    }
};
