const express = require('express');
const {  getShorts,getReddit } = require('../controllers/feed');

const router = express.Router();

// ✅ Route to fetch YouTube Shorts
router.get('/shorts', getShorts);

// ✅ Route to post data
router.get('/reddit', getReddit);

// ✅ Route to fetch Twitter videos
// router.get('/twitter', getTwitter);

module.exports = router;
