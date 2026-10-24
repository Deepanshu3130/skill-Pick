const Topic = require('../model/topic');

let cachedTopics = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

async function getTopics() {
    const now = Date.now();
    if (!cachedTopics || now - lastCacheTime > CACHE_TTL_MS) {
        cachedTopics = await Topic.find({}).select('name slug aliases parent').lean();
        lastCacheTime = now;
    }
    return cachedTopics;
}

function invalidateTopicCache() {
    cachedTopics = null;
    lastCacheTime = 0;
}

/**
 * Matches resource title + description against all topic names and aliases using whole-word matching.
 * Skips terms shorter than 3 chars.
 * Returns array of deduplicated topic slugs including matched topics' parent slugs.
 */
async function tagResource(resource, topicSlug = null, parentSlug = null) {
    const assignedSlugs = new Set();

    if (topicSlug) assignedSlugs.add(topicSlug.toLowerCase().trim());
    if (parentSlug) assignedSlugs.add(parentSlug.toLowerCase().trim());

    const title = (resource.title || '').toLowerCase();
    const description = (resource.description || '').toLowerCase();
    const textToMatch = `${title} ${description}`;

    if (!textToMatch.trim()) {
        return Array.from(assignedSlugs);
    }

    try {
        const topics = await getTopics();
        
        for (const topic of topics) {
            const termsToTest = [topic.name, ...(topic.aliases || [])];

            for (const term of termsToTest) {
                if (!term || term.trim().length < 3) continue;

                const escaped = term.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const wholeWordRegex = new RegExp(`\\b${escaped}\\b`, 'i');

                if (wholeWordRegex.test(textToMatch)) {
                    assignedSlugs.add(topic.slug);
                    if (topic.parent) {
                        assignedSlugs.add(topic.parent);
                    }
                    break; // Matched this topic, move to next
                }
            }
        }
    } catch (err) {
        console.error("Error in tagResource:", err.message);
    }

    return Array.from(assignedSlugs);
}

module.exports = {
    tagResource,
    getTopics,
    invalidateTopicCache
};
