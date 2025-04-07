const express = require('express');
const router = express.Router();
const {ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const {getCourses , getCourseById} = require('../controlers/getCourse');
const {clerkWebhook} = require('../controlers/clerkWebhook');
const {sendMessage,getUsers,getMessages} = require('../controlers/message');
const { joinChannel, getUserChannels, sendMessageToChannel, getMessagesForChannel } = require('../controlers/community');
const { getPlatformCourses } = require('../controlers/filters');



router.post("/webhook/clerk-user", clerkWebhook);
router.post('/getCourse',getCourses);
router.post('/sendMessage/:id',ClerkExpressWithAuth() , sendMessage);
router.get('/getUsers',ClerkExpressWithAuth(), getUsers);
router.get('/getMessages/:id',ClerkExpressWithAuth(), getMessages);

router.get('/getCourseById/:id' , getCourseById);

router.post('/joinChannel' ,ClerkExpressWithAuth(), joinChannel )
router.get('/getUserChannels' , ClerkExpressWithAuth() , getUserChannels)
router.post('/sendMessageToChannel/:channelId' ,ClerkExpressWithAuth(), sendMessageToChannel )
router.get('/getMessagesForChannel/:channelId' ,ClerkExpressWithAuth() , getMessagesForChannel);
router.get('/getPlatformCourses/:platform' , getPlatformCourses);
module.exports=router