const express = require('express');
const router = express.Router();
const { optionalUserAuth } = require('../utils/authMiddleware');
const { suggestTopics, getTopicBySlug, getTopicResources } = require('../controlers/topicController');

router.get('/suggest', suggestTopics);
router.get('/topics/:slug/resources', optionalUserAuth, getTopicResources);
router.get('/topics/:slug', getTopicBySlug);

module.exports = router;
