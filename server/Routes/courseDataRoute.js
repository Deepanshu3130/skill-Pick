const express = require('express');
const router = express.Router();
const {getCourses} = require('../controlers/getCourse');
router.post('/getCourses',getCourses);
module.exports = router;