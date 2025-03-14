const express = require('express');
const {  getShorts } = require('../controllers/feed');

const router = express.Router();

// ✅ Route to fetch YouTube Shorts
router.get('/shorts', getShorts);

// ✅ Route to post data
// router.post('/data', postData);

// ✅ Route to fetch Twitter videos
// router.get('/twitter', getTwitter);

module.exports = router;
