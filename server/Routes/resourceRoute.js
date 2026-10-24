const express = require('express');
const router = express.Router();
const { requireUserAuth } = require('../utils/authMiddleware');
const {
    addFromLink,
    searchResources,
    pickResource,
    searchGithub,
    pickRepo,
    addManual,
    upvoteResource,
    reportResource
} = require('../controlers/resourceController');

// All submission endpoints require authentication
router.post('/from-link', requireUserAuth, addFromLink);
router.post('/search', requireUserAuth, searchResources);
router.post('/search-web', requireUserAuth, searchResources); // Alias for backward compatibility
router.post('/pick', requireUserAuth, pickResource);
router.post('/github-search', requireUserAuth, searchGithub);
router.post('/pick-repo', requireUserAuth, pickRepo);
router.post('/manual', requireUserAuth, addManual);

// Moderation
router.post('/:id/upvote', requireUserAuth, upvoteResource);
router.post('/:id/report', requireUserAuth, reportResource);

module.exports = router;
