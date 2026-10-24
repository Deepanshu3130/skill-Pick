const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

async function backfillLegacyCourses() {
    const mongoUri = process.env.dataBase_url;
    if (!mongoUri) {
        console.error("Missing dataBase_url in .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB for legacy course migration.");

        const collection = mongoose.connection.collection('coursedetails');
        const legacyDocs = await collection.find({ externalId: { $exists: false } }).toArray();
        console.log(`Remaining legacy documents to update: ${legacyDocs.length}`);

        if (legacyDocs.length === 0) {
            console.log("All documents are already up to date.");
            return;
        }

        const batchSize = 500;
        let totalUpdated = 0;

        for (let i = 0; i < legacyDocs.length; i += batchSize) {
            const chunk = legacyDocs.slice(i, i + batchSize);
            const operations = chunk.map(doc => {
                let externalId = `legacy-${doc._id.toString()}`;
                if (doc.platform === 'YouTube' && doc.link) {
                    const listMatch = doc.link.match(/list=([a-zA-Z0-9_-]+)/);
                    const videoMatch = doc.link.match(/v=([a-zA-Z0-9_-]+)/);
                    if (listMatch) externalId = listMatch[1];
                    else if (videoMatch) externalId = videoMatch[1];
                }

                const currentType = doc.type;
                const pricingType = (currentType === 'paid' || currentType === 'free') ? currentType : 'free';
                const topicSlug = doc.query ? doc.query.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') : 'web-development';

                return {
                    updateOne: {
                        filter: { _id: doc._id },
                        update: {
                            $set: {
                                type: 'course',
                                pricingType: pricingType,
                                externalId: externalId,
                                topics: [topicSlug],
                                meta: {},
                                status: 'approved',
                                roomId: `course:${externalId}`,
                                level: doc.level || 'intermediate'
                            }
                        }
                    }
                };
            });

            const result = await collection.bulkWrite(operations, { ordered: false });
            totalUpdated += result.modifiedCount || operations.length;
            console.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(legacyDocs.length / batchSize)} - modified: ${result.modifiedCount}`);
        }

        console.log(`Successfully migrated ${totalUpdated} legacy documents in bulk.`);
    } catch (error) {
        console.error("Error during legacy migration:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

backfillLegacyCourses();
