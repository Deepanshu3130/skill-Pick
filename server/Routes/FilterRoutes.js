const express = require('express');
const { getYoutubeCourses, getUdemyCourses1, getCourseraCourses1 } = require('../controlers/filters');
const { getUdemyCourses } = require('../udemyScrapper');
const router = express.Router();

router.get("/getYoutubeCourses", getYoutubeCourses);
router.get("/getUdemyCourses", getUdemyCourses1); 
router.get("/getCourseraCourses", getCourseraCourses1);

module.exports=router