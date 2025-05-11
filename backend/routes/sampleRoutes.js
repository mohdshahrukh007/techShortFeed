const express = require('express');
const {  getShorts,getReddit } = require('../controllers/feed');

const router = express.Router();

// ✅ Route to fetch YouTube Shorts
router.post('/shorts', getShorts);

// ✅ Route to post data
router.get('/reddit', getReddit);

let shutdown = false; 
// ✅ Route to toggle shutdown state
router.get('/shutdown/:state', (req, res) => {
    const state = req.params.state === '1'; // Convert "1" to true, otherwise false
    shutdown = state;
    res.status(200).json({ shutdown:true });
});

// ✅ Route to get the current shutdown state
router.get('/shutdown', (req, res) => {
    res.status(200).json({ shutdown });
});
// ✅ Route to fetch Twitter videos
// router.get('/twitter', getTwitter);

module.exports = router;
