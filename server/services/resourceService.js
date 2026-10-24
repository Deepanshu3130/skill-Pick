const Topic = require('../model/topic');
const courseDetail = require('../model/courseDetail');
const { fetchYoutubePlaylists } = require('./youtubeService');
const { fetchGithubRepos } = require('./githubService');

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Fetch and upsert external resources (YouTube + GitHub) for a given topic.
 */
async function fetchAndStoreResources(topic) {
    try {
        console.log(`[ResourceService] Fetching fresh resources for topic: "${topic.name}" (${topic.slug})`);

        // Fetch concurrently from YouTube & GitHub
        const [youtubeItems, githubItems] = await Promise.all([
            fetchYoutubePlaylists(topic.name, topic.slug, topic.parent),
            fetchGithubRepos(topic.slug, topic.parent)
        ]);

        const allItems = [...youtubeItems, ...githubItems];
        console.log(`[ResourceService] Received ${youtubeItems.length} courses & ${githubItems.length} repos for ${topic.slug}`);

        if (allItems.length > 0) {
            const bulkOps = allItems.map(item => ({
                updateOne: {
                    filter: { type: item.type, externalId: item.externalId },
                    update: {
                        $set: {
                            platform: item.platform,
                            provider: item.provider,
                            title: item.title,
                            description: item.description,
                            imageUrl: item.imageUrl,
                            duration: item.duration,
                            lectures: item.lectures,
                            link: item.link,
                            meta: item.meta,
                            status: item.status || 'approved',
                            roomId: item.roomId,
                            level: item.level || 'intermediate',
                            pricingType: item.pricingType || 'free'
                        },
                        $addToSet: {
                            topics: { $each: item.topics }
                        }
                    },
                    upsert: true
                }
            }));

            await courseDetail.bulkWrite(bulkOps, { ordered: false });
        }

        // Update topic lastFetchedAt
        await Topic.updateOne(
            { slug: topic.slug },
            { $set: { lastFetchedAt: new Date() } }
        );

        return allItems;
    } catch (error) {
        console.error(`[ResourceService] Error in fetchAndStoreResources for ${topic.slug}:`, error.message);
        return [];
    }
}

/**
 * Cache-first topic resource management:
 * - If fetched < 7 days ago and >= 5 stored items: return stored data only.
 * - If older than 7 days and >= 5 stored: return stored data immediately & refresh in background.
 * - If < 5 stored items: fetch immediately.
 */
async function ensureTopicResources(topic) {
    if (!topic) return;

    const count = await courseDetail.countDocuments({
        topics: topic.slug,
        status: "approved"
    });

    const isOlderThan7Days = !topic.lastFetchedAt || (Date.now() - new Date(topic.lastFetchedAt).getTime()) > SEVEN_DAYS_MS;

    if (count < 5) {
        console.log(`[ResourceService] Topic ${topic.slug} has ${count} items (< 5). Fetching immediately.`);
        await fetchAndStoreResources(topic);
    } else if (isOlderThan7Days) {
        console.log(`[ResourceService] Topic ${topic.slug} is older than 7 days. Refreshing in background.`);
        fetchAndStoreResources(topic).catch(err => {
            console.error(`[ResourceService] Background refresh failed for ${topic.slug}:`, err.message);
        });
    } else {
        console.log(`[ResourceService] Topic ${topic.slug} served from cache (${count} items, fetched recently).`);
    }
}

/**
 * Returns structured resources for a topic:
 * { main, broader (parent topic), similar (related topics) }
 * for both courses and repos, with duplicates removed.
 * Searching a parent topic also includes its children in main.
 */
async function getHierarchicalResources(slug, userId = null) {
    const rawQuery = (slug || '').trim().toLowerCase();
    const slugified = rawQuery.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // 1. Find topic definition or alias match
    let topic = await Topic.findOne({
        $or: [
            { slug: slugified },
            { slug: rawQuery },
            { aliases: rawQuery },
            { aliases: slugified }
        ]
    });

    if (!topic) {
        // Create an on-the-fly transient topic so any free-form query works seamlessly
        const nameGuess = rawQuery.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        topic = await Topic.create({
            name: nameGuess,
            slug: slugified || 'general',
            aliases: [rawQuery, nameGuess.toLowerCase()],
            parent: null,
            related: []
        });
    }

    // Increment search count
    await Topic.updateOne({ _id: topic._id }, { $inc: { searchCount: 1 } });

    // Ensure cache-first resources are fetched/present
    await ensureTopicResources(topic);

    // 2. Identify all slugs to include in "main":
    // Includes this topic's slug, PLUS any child topics if this topic is a parent.
    const childTopics = await Topic.find({ parent: topic.slug }).select('slug');
    const childSlugs = childTopics.map(c => c.slug);
    const mainSlugs = [topic.slug, ...childSlugs];

    // 3. Identify broader slug (parent)
    const broaderSlug = topic.parent || null;

    // 4. Identify similar slugs (related)
    const similarSlugs = topic.related || [];

    // 5. Query approved resources (and pending only if addedBy === userId)
    const allQuerySlugs = [...new Set([...mainSlugs, ...(broaderSlug ? [broaderSlug] : []), ...similarSlugs])];
    
    const queryConditions = [
        { topics: { $in: allQuerySlugs } },
        { query: new RegExp(rawQuery, 'i') }
    ];

    const titleWords = rawQuery.split(/\s+/).filter(w => w.length > 2);
    if (titleWords.length > 0) {
        queryConditions.push({ title: new RegExp(titleWords.join('|'), 'i') });
    }

    const statusFilter = userId
        ? { $or: [{ status: "approved" }, { status: "pending", addedBy: userId }] }
        : { status: "approved" };

    const rawResources = await courseDetail.find({
        $and: [
            { $or: queryConditions },
            statusFilter
        ]
    }).sort({ skillPickRating: -1, createdAt: -1 });

    const seenIds = new Set();

    const courses = { main: [], broader: [], similar: [] };
    const repos = { main: [], broader: [], similar: [] };

    // Categorize Main results first
    for (const res of rawResources) {
        const hasMainTopic = res.topics?.some(t => mainSlugs.includes(t)) ||
                             (res.query && new RegExp(rawQuery, 'i').test(res.query)) ||
                             (res.title && new RegExp(rawQuery, 'i').test(res.title));

        if (hasMainTopic) {
            seenIds.add(res._id.toString());
            if (res.type === 'repo') {
                repos.main.push(res);
            } else {
                courses.main.push(res);
            }
        }
    }

    // Categorize Broader results (parent topic), excluding already seen
    if (broaderSlug) {
        for (const res of rawResources) {
            const idStr = res._id.toString();
            if (!seenIds.has(idStr) && res.topics?.includes(broaderSlug)) {
                seenIds.add(idStr);
                if (res.type === 'repo') {
                    repos.broader.push(res);
                } else {
                    courses.broader.push(res);
                }
            }
        }
    }

    // Categorize Similar results (related topics), excluding already seen
    for (const res of rawResources) {
        const idStr = res._id.toString();
        if (!seenIds.has(idStr) && res.topics?.some(t => similarSlugs.includes(t))) {
            seenIds.add(idStr);
            if (res.type === 'repo') {
                repos.similar.push(res);
            } else {
                courses.similar.push(res);
            }
        }
    }

    return {
        topic: {
            name: topic.name,
            slug: topic.slug,
            parent: topic.parent,
            related: topic.related,
            searchCount: topic.searchCount
        },
        courses,
        repos
    };
}

module.exports = {
    fetchAndStoreResources,
    ensureTopicResources,
    getHierarchicalResources
};
