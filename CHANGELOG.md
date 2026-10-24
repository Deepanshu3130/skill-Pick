# SkillPick Comprehensive Changelog

## Scraping Removal Deep-Clean
- **Deleted All Scraping Code Files**:
  - `server/udemyScrapper.js`
  - `server/cousera.js`
  - `server/random.js`
  - `server/Routes/FilterRoutes.js`
- **Removed All Scraping Packages & Pruned `node_modules`**:
  - Removed `puppeteer`, `puppeteer-core`, `puppeteer-extra`, `puppeteer-extra-plugin-*`, `random-useragent`, `cheerio`, `https-proxy-agent` from `server/package.json`.
  - Pruned 191 unused packages from `server/node_modules`.
- **Purged Scraping Secrets & Configs**:
  - Removed `BROWSERLESS_TOKEN` from `server/.env`.
- **Rebuilt Dockerfile**:
  - Replaced the heavy `ghcr.io/puppeteer/puppeteer:24.2.1` base image and Chromium flags with a clean, lightweight `node:20-alpine` production image.
- **Removed Scraping Controllers & Routes**:
  - Purged `getUdemyCourses1` and `getCourseraCourses1` from `server/controlers/filters.js`.
- **Updated Frontend Pages & Platform Navigation**:
  - Replaced Udemy/Coursera cards in `Home.jsx` with official **YouTube** and **GitHub** integrations.
  - Refactored `PlatformPage.jsx` to serve official YouTube courses and GitHub repositories.
  - Updated `AboutUs.jsx` copy to reference YouTube video courses and GitHub open-source repositories.
  - Updated `Courses.jsx` filter sidebar options to `YouTube`, `Community`, and `GitHub`.
- **Updated Documentation**:
  - Refactored `README.md` to document official YouTube and GitHub APIs and removed all mentions of Puppeteer, web scraping, and Browserless.
- **Verification**:
  - Automated regex scan confirms **0 occurrences** of `puppeteer`, `cheerio`, `browserless`, or `scrap` across all application code.

---

## Phase 0: Audit & Architecture Review
- Completed full audit of existing models, routes, scraping implementations, and Socket.IO real-time chat architecture.
- Designed non-breaking, in-place migration plan to transition SkillPick from web scraping to official APIs (YouTube + GitHub), Atlas Search autocomplete, hierarchical topic links, SSRF-protected resource submission panel, and authenticated in-room DMs.

## Phase 1: Remove Scraping & Clean Up
- Deleted scraping files: `server/udemyScrapper.js`, `server/cousera.js`, `server/random.js`, `server/Routes/FilterRoutes.js`.
- Cleaned up `server/utils/gatherData.js` to rely only on official YouTube data.
- Refactored `server/youtubeData.js` to eliminate secret logs (`console.log(API_KEY)` removed) and safely return array data.
- Added `server/.env.example`, `frontend/.env.example`, and root `.env.example` templates.
- Verified server and YouTube fetching pipeline.

## Phase 2: Topics and Autocomplete
- Created `Topic` model (`server/model/topic.js`) with `{ name, slug, aliases, parent, related, searchCount, lastFetchedAt }`.
- Created and executed topic seeder (`server/scripts/seedTopics.js`) seeding 36 tech topics with parent-child hierarchies and aliases.
- Created `GET /api/suggest?q=` controller (`server/controlers/topicController.js`) and router (`server/Routes/topicRoute.js`) utilizing Atlas Search `topics_autocomplete` index with resilient regex fallback.
- Provided MongoDB Atlas Search Index JSON definition (`topics_autocomplete`).
- Implemented reusable `SearchAutocomplete` component (`frontend/src/Components/SearchAutocomplete.jsx`) with 300ms debounce, AbortController cancellation for in-flight requests, and full keyboard navigation (arrows, Enter, Esc).
- Integrated `SearchAutocomplete` into `Navbar.jsx` and `Home.jsx`.

## Phase 3: Resources with Cache-First Logic
- Extended `courseDetail` model with `type` ("course" | "repo"), `externalId`, `topics[]`, `meta`, `status` ("approved"|"pending"|"rejected"), `addedBy`, `roomId`, and compound unique index `{ type: 1, externalId: 1 }`.
- Created `server/scripts/backfillLegacyCourses.js` and bulk-migrated all 3,015 existing course documents to the new schema without deleting or losing any data.
- Created GitHub API fetcher (`server/services/githubService.js`) to search repos by `topic:<slug>` sorted by stars.
- Created YouTube playlist fetcher (`server/services/youtubeService.js`) prioritizing playlists and full courses with quota limit handling.
- Implemented cache-first resource orchestrator (`server/services/resourceService.js`):
  - If topic fetched < 7 days ago and has >= 5 items: serve from cache.
  - If older than 7 days and has >= 5 items: return stored data immediately & trigger background refresh.
  - If < 5 items: fetch immediately.
- Implemented `GET /api/topics/:slug/resources` endpoint returning `{ main, broader, similar }` for courses and repos, including child topics in parent searches with duplicates removed.

## Phase 4: Results Page
- Updated `frontend/src/pages/Courses.jsx` with section tabs: **Courses** and **GitHub Repos**.
- Implemented three-tier hierarchical presentation:
  1. Main topic results (including child topics).
  2. "From <Parent>" broader topic recommendations.
  3. "Also explore: <related>" with clickable topic badges and similar recommendations.
- Enhanced `frontend/src/Components/CourseCard.jsx` to render both Courses (duration, lectures, video links) and GitHub Repos (stars, forks, language badges, repository links).
- Added fixed floating side button: **"Can't find your resource?"**.

## Phase 5: Add Resource Panel
- Created SSRF validator (`server/utils/ssrfValidator.js`) enforcing http/https only, resolving DNS, and blocking private/internal IPs, loopback, and link-local addresses.
- Implemented URL normalizer stripping UTM and tracking parameters.
- Implemented `POST /api/resources/from-link` with 5s timeout, 1MB limit, official GitHub/YouTube metadata extraction, and Open Graph tag fallback.
- Added duplicate resource detection.
- Implemented `POST /api/resources/search-web` integration via Brave Search API.
- Implemented resource moderation: pending resources visible to submitter, auto-approved upon reaching 3 upvotes (`POST /api/resources/:id/upvote`), and reportable (`POST /api/resources/:id/report`).
- Built interactive frontend modal (`frontend/src/Components/AddResourceModal.jsx`) supporting direct link submission and web search.

## Phase 6: Chat Adjustments & Socket Security
- Updated `server/config/socket.js` to enforce Clerk JWT verification on socket connection via `@clerk/clerk-sdk-node`. Rejected unauthenticated connections and removed client-supplied `userId` trust.
- Updated `frontend/src/App.jsx` to securely transmit fresh Clerk JWT via `auth: { token }`.
- Standardized room IDs to `course:<externalId>` and `repo:<owner/repo>` and updated `Channel` model with `roomId`.
- Implemented in-room DMs:
  - Rooms formatted as `dm:<smallerUserId>:<largerUserId>`.
  - Restricted DMs strictly to users who are actively present in the specified resource room.
  - Added real-time membership validation events: `joinInRoomDm`, `inRoomDmReady`, `sendInRoomDm`, `newInRoomDmMessage`.

## Search & Runtime Diagnostic Fixes
- **Backend Service Resumption**: Started `server/index.cjs` as an active daemon process listening on port 3000 alongside MongoDB Atlas connection.
- **CORS Permissiveness**: Updated `server/index.cjs` CORS configuration to allow requests from any local development origin (`http://localhost:5173`, `http://127.0.0.1:5173`) and production URLs.
- **Frontend API Base Consistency**:
  - Updated `frontend/src/operations/apiConnectors.js` and `frontend/src/Components/SearchAutocomplete.jsx` to dynamically respect `VITE_BASE_URL` with clean whitespace trimming and robust development fallback to `http://localhost:3000`.
  - Cleaned up whitespace in `frontend/.env`.
- **Search Resiliency & Data Mapping**:
  - Extended `server/services/resourceService.js` to query by topic slugs, legacy query names, and regex title matching across all 3,015 legacy records.
  - Added robust fallback handling in `frontend/src/pages/Courses.jsx` for both `getTopicResources` and legacy `getCourses` so users never see broken or hanging states.
  - Updated `filterItems` in `Courses.jsx` to case-insensitively match platforms and prices, supporting `YouTube`, `Udemy`, `Coursera`, and `Community`.

## Phase 5 Update: "Can't find your course?" Panel & Verified Resource Ingestion
- **Purged HTML Scraping & Open Graph Parser**:
  - Removed all HTML crawling, cheerio references, and regex Open Graph parsers from `resourceController.js`.
  - Enforced strict reliance on official APIs: **YouTube Data API v3**, **GitHub REST API**, and **Brave Search API**.
- **Two-Tab Responsive Side Panel**:
  - Replaced center modal with an Inter-styled slide-over panel on desktop (`sm:w-[480px]`) and bottom sheet on mobile (`h-[90vh]`).
  - Added accessible tab navigation (`role="tablist"`, `role="tab"`, `aria-selected`):
    - **Tab 1 ("Course")**: Paste YouTube, Udemy, or Coursera links. Auto-switches to GitHub tab if a `github.com` URL is detected.
    - **Tab 2 ("GitHub repo")**: Direct GitHub repository search (`owner/repo` or keywords) with stars and language badges.
  - Added picker screen with up to 8 cards, editable *"Not right? Try a different search"* box, and manual entry fallback.
  - Added fixed right-edge vertically centered desktop button and floating bottom-right mobile button with label `"Can't find your course?"`.
- **Backend Architecture & Endpoints**:
  - `POST /api/resources/from-link`: Offline `externalId` computation, SSRF validation, duplicate check, official API verification for YouTube/GitHub, Brave Search auto-match for other URLs, and `PickSession` generation.
  - `POST /api/resources/search` (and aliased `/search-web`): Brave Search with 24-hour MongoDB TTL caching.
  - `POST /api/resources/pick`: Server-side `PickSession` result selection with index validation and duplicate check.
  - `POST /api/resources/github-search`: GitHub search with 1-hour MongoDB TTL caching and 20 searches/hour per user limit.
  - `POST /api/resources/pick-repo`: Validates `PickSession` ownership, saves approved repo with tags and `roomId: "repo:<owner/repo>"`.
  - `POST /api/resources/manual`: Manual detail submission for unlisted courses saved as `"pending"`.
- **Security & Moderation Rules**:
  - Enforced server-verified Clerk JWT via `requireUserAuth`; client-supplied `userId` in request body is strictly rejected.
  - Rate limiting: Max 10 submissions per user per day across `/from-link`, `/pick`, `/pick-repo`, `/manual` (counted on save).
  - Rate limiting: Max 20 searches per hour per user on GitHub search.
  - Pending resources are visible only to their `addedBy` creator in `getHierarchicalResources` until reaching 3 upvotes.
  - Automated auto-tagging via `tagResource()` text scanning on all saved resources.
- **Verification**:
  - Executed automated test suite `server/scripts/runSuiteTests.js` confirming all 10/10 test specifications passed.


