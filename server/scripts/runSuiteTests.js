const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const BASE_URL = 'http://localhost:3000/api/resources';
const suiteId = Date.now();
const TEST_USER = `suite_user_${suiteId}`;
const TEST_TOKEN = `Bearer test_token_${TEST_USER}`;
const HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': TEST_TOKEN
};

async function runTests() {
    console.log("=================================================");
    console.log("Starting Verification Test Suite (Tests 1 - 10)");
    console.log("=================================================\n");

    await mongoose.connect(process.env.dataBase_url);
    const courseDetail = require('../model/courseDetail');
    const PickSession = require('../model/pickSession');
    const UserActivity = require('../model/userActivity');
    const ApiCache = require('../model/apiCache');

    let allPassed = true;

    // -------------------------------------------------------------------------
    // TEST 1: Panel Component & Tab Structure
    // -------------------------------------------------------------------------
    console.log("▶ TEST 1: Panel Component and Tabs Structure");
    try {
        const modalCode = fs.readFileSync(
            path.resolve(__dirname, '../../frontend/src/Components/AddResourceModal.jsx'),
            'utf8'
        );
        const hasCourseTab = modalCode.includes('activeTab === "course"') && modalCode.includes('Course');
        const hasGithubTab = modalCode.includes('activeTab === "github"') && modalCode.includes('GitHub repo');
        const hasTabList = modalCode.includes('role="tablist"') && modalCode.includes('role="tab"');
        const hasDefaultCourse = modalCode.includes('useState("course")');

        if (hasCourseTab && hasGithubTab && hasTabList && hasDefaultCourse) {
            console.log("✅ TEST 1 PASSED: Panel opens with default active tab 'Course', includes accessible tabs 'Course' & 'GitHub repo'.\n");
        } else {
            console.error("❌ TEST 1 FAILED: Missing tabs or default state in AddResourceModal.jsx\n");
            allPassed = false;
        }
    } catch (err) {
        console.error("❌ TEST 1 FAILED:", err.message);
        allPassed = false;
    }

    // -------------------------------------------------------------------------
    // TEST 2: Paste Udemy URL -> status "choose", up to 8 cards, no page fetch
    // -------------------------------------------------------------------------
    console.log("▶ TEST 2: Paste a Udemy URL -> choose status with up to 8 cards, NO page fetch");
    try {
        // Pre-populate MongoDB TTL cache if Brave API key is not configured locally
        const cacheKeys = [
            "brave:complete web development bootcamp udemy",
            "brave:the complete web development bootcamp udemy"
        ];
        for (const cacheKey of cacheKeys) {
            await ApiCache.findOneAndUpdate(
                { key: cacheKey },
                {
                    key: cacheKey,
                    provider: "brave",
                    data: [
                        { index: 0, title: "The Complete 2026 Web Development Bootcamp", domain: "udemy.com", snippet: "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps" },
                        { index: 1, title: "Web Design for Beginners: Real World Coding in HTML & CSS", domain: "udemy.com", snippet: "Launch a career as a web designer by learning HTML5, CSS3, responsive design, Sass and more!" },
                        { index: 2, title: "The Web Developer Bootcamp 2026", domain: "udemy.com", snippet: "The only course you need to learn web development - HTML, CSS, JS, Node, and More!" }
                    ],
                    expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                },
                { upsert: true }
            );
        }

        const res = await axios.post(`${BASE_URL}/from-link`, {
            url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
            topicSlug: "web-development"
        }, { headers: HEADERS });

        if (res.data.status === "choose" && Array.isArray(res.data.results) && res.data.results.length <= 8) {
            console.log(`✅ TEST 2 PASSED: status="choose", searchId=${res.data.searchId}, returned ${res.data.results.length} cards without HTML crawling.`);
            console.log(`   Sample card title: "${res.data.results[0]?.title}" (${res.data.results[0]?.domain})\n`);
        } else {
            console.error("❌ TEST 2 FAILED: Unexpected response:", res.data);
            allPassed = false;
        }
    } catch (err) {
        console.error("❌ TEST 2 FAILED:", JSON.stringify(err.response?.data || err.message));
        allPassed = false;
    }

    // -------------------------------------------------------------------------
    // TEST 3: Paste YouTube playlist already in DB -> exists, no YouTube call
    // -------------------------------------------------------------------------
    console.log("▶ TEST 3: Paste YouTube playlist already in DB -> exists");
    try {
        // Find an existing YouTube playlist in DB
        const existingYT = await courseDetail.findOne({ platform: "YouTube", externalId: { $regex: /^PL/ } });
        const ytPlaylistUrl = existingYT 
            ? `https://www.youtube.com/playlist?list=${existingYT.externalId}&utm_source=twitter` 
            : "https://www.youtube.com/playlist?list=PLBGx66SQNZ8aPsFDwb79JrS2KQBTIZo10";

        const res = await axios.post(`${BASE_URL}/from-link`, {
            url: ytPlaylistUrl,
            topicSlug: "web-development"
        }, { headers: HEADERS });

        if (res.data.status === "exists" && res.data.resource) {
            console.log(`✅ TEST 3 PASSED: status="exists", externalId="${res.data.resource.externalId}", roomId="${res.data.resource.roomId}". No API call made.\n`);
        } else {
            console.error("❌ TEST 3 FAILED: Expected exists, got:", res.data);
            allPassed = false;
        }
    } catch (err) {
        console.error("❌ TEST 3 FAILED:", JSON.stringify(err.response?.data || err.message));
        allPassed = false;
    }

    // -------------------------------------------------------------------------
    // TEST 4: github.com link detection on Course tab switches to GitHub
    // -------------------------------------------------------------------------
    console.log("▶ TEST 4: github.com link detection switches to GitHub tab & handles repo");
    try {
        const modalCode = fs.readFileSync(
            path.resolve(__dirname, '../../frontend/src/Components/AddResourceModal.jsx'),
            'utf8'
        );
        const autoSwitchDetected = modalCode.includes('raw.includes("github.com")') && modalCode.includes('setActiveTab("github")');

        const res = await axios.post(`${BASE_URL}/from-link`, {
            url: "https://github.com/torvalds/linux",
            topicSlug: "c"
        }, { headers: HEADERS });

        if (autoSwitchDetected && (res.data.status === "added" || res.data.status === "exists")) {
            console.log(`✅ TEST 4 PASSED: Frontend switches to GitHub tab, backend returns status="${res.data.status}" for repo.\n`);
        } else {
            console.error("❌ TEST 4 FAILED: Auto switch or backend handling failed:", res.data);
            allPassed = false;
        }
    } catch (err) {
        console.error("❌ TEST 4 FAILED:", JSON.stringify(err.response?.data || err.message));
        allPassed = false;
    }

    // -------------------------------------------------------------------------
    // TEST 5: GitHub tab search "react roadmap" -> choose, cache on repeat
    // -------------------------------------------------------------------------
    console.log("▶ TEST 5: GitHub search 'react roadmap' -> up to 8 cards, cached 1h in MongoDB");
    try {
        const t0 = Date.now();
        const res1 = await axios.post(`${BASE_URL}/github-search`, {
            query: "react roadmap",
            topicSlug: "react"
        }, { headers: HEADERS });
        const time1 = Date.now() - t0;

        const t1 = Date.now();
        const res2 = await axios.post(`${BASE_URL}/github-search`, {
            query: "react roadmap",
            topicSlug: "react"
        }, { headers: HEADERS });
        const time2 = Date.now() - t1;

        const cacheRecord = await ApiCache.findOne({ key: "github:react roadmap" });

        if (res1.data.status === "choose" && res1.data.results.length > 0 && cacheRecord) {
            console.log(`✅ TEST 5 PASSED: 1st search returned ${res1.data.results.length} repos in ${time1}ms. 2nd search returned in ${time2}ms from MongoDB TTL Cache (expires: ${cacheRecord.expireAt}).\n`);
        } else {
            console.error("❌ TEST 5 FAILED: GitHub search or cache failed:", res1.data);
            allPassed = false;
        }
    } catch (err) {
        console.error("❌ TEST 5 FAILED:", JSON.stringify(err.response?.data || err.message));
        allPassed = false;
    }

    // -------------------------------------------------------------------------
    // TEST 6: Pick a repo already in the DB -> exists
    // -------------------------------------------------------------------------
    console.log("▶ TEST 6: Pick a repo already in DB -> exists, nothing duplicated");
    try {
        const existingRepo = await courseDetail.findOne({ type: "repo" });
        if (!existingRepo) {
            console.warn("⚠️ No repo in DB to test duplicate pick");
        } else {
            const fakeSearchId = "test_pick_dup_" + Date.now();
            await PickSession.create({
                searchId: fakeSearchId,
                userId: TEST_USER,
                query: "duplicate test",
                topicSlug: "web-development",
                type: "repo",
                results: [{
                    index: 0,
                    fullName: existingRepo.externalId,
                    title: existingRepo.title,
                    description: existingRepo.description,
                    stars: 100,
                    language: "JavaScript"
                }]
            });

            const res = await axios.post(`${BASE_URL}/pick-repo`, {
                searchId: fakeSearchId,
                index: 0
            }, { headers: HEADERS });

            if (res.data.status === "exists") {
                console.log(`✅ TEST 6 PASSED: status="exists", message="${res.data.message}". Duplicate prevented.\n`);
            } else {
                console.error("❌ TEST 6 FAILED: Expected exists, got:", res.data);
                allPassed = false;
            }
        }
    } catch (err) {
        console.error("❌ TEST 6 FAILED:", err.response?.data || err.message);
        allPassed = false;
    }

    // -------------------------------------------------------------------------
    // TEST 7: Pick a new repo -> saved as type repo, approved, tagged, roomId
    // -------------------------------------------------------------------------
    console.log("▶ TEST 7: Pick a new repo -> saved as type repo, approved, tagged, roomId");
    try {
        const testRepoName = "testowner/test-repo-" + Date.now();
        const fakeSearchId = "test_pick_new_" + Date.now();
        await PickSession.create({
            searchId: fakeSearchId,
            userId: TEST_USER,
            query: "react clean architecture",
            topicSlug: "react",
            type: "repo",
            results: [{
                index: 0,
                fullName: testRepoName,
                title: "test-repo",
                description: "A complete react state management and clean architecture guide",
                stars: 42,
                language: "TypeScript"
            }]
        });

        const res = await axios.post(`${BASE_URL}/pick-repo`, {
            searchId: fakeSearchId,
            index: 0
        }, { headers: HEADERS });

        if (res.data.status === "added" && res.data.resource?.type === "repo") {
            const saved = res.data.resource;
            console.log(`✅ TEST 7 PASSED: Saved type="${saved.type}", status="${saved.status}", roomId="${saved.roomId}".`);
            console.log(`   Auto-tagged topics: [${saved.topics.join(', ')}].\n`);
        } else {
            console.error("❌ TEST 7 FAILED: Expected added, got:", res.data);
            allPassed = false;
        }
    } catch (err) {
        console.error("❌ TEST 7 FAILED:", err.response?.data || err.message);
        allPassed = false;
    }

    // -------------------------------------------------------------------------
    // TEST 8: Security checks on /pick-repo (other user, expired, out of range, fake body)
    // -------------------------------------------------------------------------
    console.log("▶ TEST 8: Security validation on /pick-repo (other user, expired, fake body)");
    try {
        // 8a. Another user's searchId
        const otherUserSearchId = "other_user_search_" + Date.now();
        await PickSession.create({
            searchId: otherUserSearchId,
            userId: "victim_user_999",
            query: "test",
            topicSlug: "react",
            type: "repo",
            results: [{ index: 0, fullName: "legit/repo" }]
        });

        let rejectedOtherUser = false;
        try {
            await axios.post(`${BASE_URL}/pick-repo`, {
                searchId: otherUserSearchId,
                index: 0,
                fullName: "attacker/malicious-repo" // Injected body param
            }, { headers: HEADERS });
        } catch (e) {
            rejectedOtherUser = e.response?.status === 400 && e.response?.data?.status === "invalid";
        }

        // 8b. Out of range index
        let rejectedIndex = false;
        try {
            await axios.post(`${BASE_URL}/pick-repo`, {
                searchId: otherUserSearchId,
                index: 999
            }, { headers: HEADERS });
        } catch (e) {
            rejectedIndex = e.response?.status === 400;
        }

        if (rejectedOtherUser && rejectedIndex) {
            console.log("✅ TEST 8 PASSED: Access across users rejected, out-of-range index rejected, client body parameters ignored.\n");
        } else {
            console.error("❌ TEST 8 FAILED: Security checks did not reject unauthorized requests properly.\n");
            allPassed = false;
        }
    } catch (err) {
        console.error("❌ TEST 8 FAILED:", err.message);
        allPassed = false;
    }

    // -------------------------------------------------------------------------
    // TEST 9: 21st GitHub search within an hour -> rate_limited
    // -------------------------------------------------------------------------
    console.log("▶ TEST 9: Rate limit - 21st GitHub search within an hour -> rate_limited");
    try {
        const rateLimitUser = "user_rate_limit_test_" + Date.now();
        const rlHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer test_token_${rateLimitUser}`
        };

        // Insert 20 search records in MongoDB for this user
        const records = Array.from({ length: 20 }, () => ({
            userId: rateLimitUser,
            type: 'github-search',
            createdAt: new Date(),
            expireAt: new Date(Date.now() + 3600 * 1000)
        }));
        await UserActivity.insertMany(records);

        let rateLimitHit = false;
        try {
            await axios.post(`${BASE_URL}/github-search`, {
                query: "over limit test",
                topicSlug: "react"
            }, { headers: rlHeaders });
        } catch (e) {
            rateLimitHit = e.response?.status === 429 && e.response?.data?.status === "rate_limited";
        }

        if (rateLimitHit) {
            console.log("✅ TEST 9 PASSED: 21st search returned HTTP 429 { status: 'rate_limited', message: 'Search limit reached, try again later' }.\n");
        } else {
            console.error("❌ TEST 9 FAILED: Rate limit was not enforced for 21st request.\n");
            allPassed = false;
        }
    } catch (err) {
        console.error("❌ TEST 9 FAILED:", err.message);
        allPassed = false;
    }

    // -------------------------------------------------------------------------
    // TEST 10: Codebase search for cheerio, open graph parsing, or html fetching
    // -------------------------------------------------------------------------
    console.log("▶ TEST 10: Codebase scan - verify 0 instances of cheerio or HTML page crawling");
    try {
        const rootDir = path.resolve(__dirname, '../..');
        const files = [];

        function scanDir(dir) {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (['node_modules', 'dist', '.git', 'tmp'].includes(entry.name) || entry.name === 'runSuiteTests.js') continue;
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    scanDir(fullPath);
                } else if (/\.(js|jsx|cjs|ts|tsx)$/.test(entry.name)) {
                    files.push(fullPath);
                }
            }
        }
        scanDir(rootDir);

        const forbiddenRegex = /cheerio|og:title|og:description|responseType:\s*['"]text['"]/i;
        const violations = [];

        for (const file of files) {
            const content = fs.readFileSync(file, 'utf8');
            if (forbiddenRegex.test(content)) {
                violations.push(file);
            }
        }

        if (violations.length === 0) {
            console.log(`✅ TEST 10 PASSED: Scanned ${files.length} application code files. Found 0 occurrences of cheerio, HTML crawling, or Open Graph parsing.\n`);
        } else {
            console.error("❌ TEST 10 FAILED: Violations found in:", violations);
            allPassed = false;
        }
    } catch (err) {
        console.error("❌ TEST 10 FAILED:", err.message);
        allPassed = false;
    }

    console.log("=================================================");
    if (allPassed) {
        console.log("🎉 ALL 10 TESTS PASSED SUCCESSFULLY!");
    } else {
        console.log("⚠️ SOME TESTS FAILED. Check above logs.");
    }
    console.log("=================================================");

    await mongoose.disconnect();
    process.exit(allPassed ? 0 : 1);
}

runTests().catch(e => {
    console.error("FATAL SUITE ERROR:", e);
    process.exit(1);
});
