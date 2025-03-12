const express = require('express');
const {  getShortsApi } = require('../controllers/feed');

const router = express.Router();

// ✅ Route to fetch YouTube Shorts
router.get('/shorts', getShortsApi);

// ✅ Route to post data
// router.post('/data', postData);

// ✅ Route to fetch Twitter videos
// router.get('/twitter', getTwitter);

module.exports = router;
