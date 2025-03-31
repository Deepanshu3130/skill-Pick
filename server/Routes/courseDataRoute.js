const express = require('express');
const router = express.Router();
const {ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const {getCourses} = require('../controlers/getCourse');
const {clerkWebhook} = require('../controlers/clerkWebhook');
const {sendMessage,getUsers,getMessages} = require('../controlers/message');


router.post("/webhook/clerk-user", clerkWebhook);
router.post('/getCourse',getCourses);
router.post('/sendMessage/:id',ClerkExpressWithAuth() , sendMessage);
router.get('/getUsers',ClerkExpressWithAuth(), getUsers);
router.get('/getMessages/:id',ClerkExpressWithAuth(), getMessages);
module.exports = router;