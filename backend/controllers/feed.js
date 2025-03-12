const axios = require("axios");
const puppeteer = require("puppeteer");
require("dotenv").config(); // Load .env file

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

// // ✅ Fetch YouTube Shorts
// const getShorts = async (req, res) => {
//   try {
//     const searchQuery = "javascript";
//     const url =
//       `https://www.googleapis.com/youtube/v3/search?part=snippet` +
//       `&q=${encodeURIComponent(searchQuery)}` +
//       `&type=video` +
//       `&videoDuration=short` + // ✅ Filter for Shorts
//       `&maxResults=10` +
//       `&videoDefinition=high` +
//       `&order=relevance` +
//       `&safeSearch=moderate` +
//       `&relevanceLanguage=en` +
//       `&regionCode=US` +
//       `&videoEmbeddable=true` +
//       `&key=${YOUTUBE_API_KEY}`;

//     const response = await axios.get(url);
//     const videos = response.data.items.map((video) => ({
//       title: video.snippet.title,
//       videoId: video.id.videoId,
//       thumbnail: video.snippet.thumbnails.high.url,
//     }));

//     console.log(videos);

//     res.json({ videos });
//   } catch (error) {
//     console.log("YOUTUBE_API_KEY:", YOUTUBE_API_KEY);
//     console.log("CHANNEL_ID:", CHANNEL_ID);
//     console.error("❌ Error fetching YouTube Shorts:", error.message);
//     res.status(500).json({ error: "Failed to fetch YouTube Shorts" });
//   }
// };


const getShortViaScrapold = async (keyword) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Construct search URL for Shorts with keyword
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    keyword
  )}&sp=EgQQARgB`; // Filters for Shorts

  console.log(`Searching for: ${keyword}`);
  await page.goto(searchUrl, { waitUntil: "networkidle2" });

  // Wait for the shorts container to load
  await page.waitForSelector("ytd-video-renderer");

  // Extract video data
  const videos = await page.evaluate(() => {
    const videoElements = document.querySelectorAll("ytd-video-renderer");
  
    return Array.from(videoElements).map((video) => {
      const title =
        video.querySelector("#video-title")?.innerText || "No title";
  
      // Get the video ID from the watch URL and convert to an embed URL
      let url = video.querySelector("#thumbnail")?.href || "";
      const videoId = url.match(/v=([^&]+)/)?.[1];
      if (videoId) {
        url = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1`;
      }
      const views =
        video.querySelector("#metadata-line span")?.innerText || "No views";
      const thumbnail = video.querySelector("img")?.src || "";
  
      return {
        videoId,
        title,
        url,
        views,
        thumbnail,
      };
    });
  });
  

  console.log(`Scraped ${videos.length} shorts`);

  await browser.close();

  return videos;
};

const getShortsApi = async (req, res) => {
  console.log(req.query);
  const query = req?.query?.query || "javascript";
  if (!query) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    console.log(`➡️ Fetching yt videos for: ${query}`);
    const videos = await getShortViaScrap(query); // ✅ Properly returning the result
    res.json({ videos });
  } catch (error) {
    console.error("❌ Error fetching yt videos:", error.message);
    res.status(500).json({ error: "Failed to fetch yt videos" });
  }
};
const chromium = require('chrome-aws-lambda');

const getShortViaScrap = async (keyword) => {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true
  });

  const page = await browser.newPage();
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    keyword
  )}&sp=EgQQARgB`;

  console.log(`Searching for: ${keyword}`);
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  // Wait for the shorts container to load
  await page.waitForSelector('ytd-video-renderer');

  const videos = await page.evaluate(() => {
    const videoElements = document.querySelectorAll('ytd-video-renderer');

    return Array.from(videoElements).map((video) => {
      const title = video.querySelector('#video-title')?.innerText || 'No title';
      let url = video.querySelector('#thumbnail')?.href || '';
      const videoId = url.match(/v=([^&]+)/)?.[1];
      if (videoId) {
        url = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1`;
      }
      const views = video.querySelector('#metadata-line span')?.innerText || 'No views';
      const thumbnail = video.querySelector('img')?.src || '';

      return { videoId, title, url, views, thumbnail };
    });
  });

  console.log(`Scraped ${videos.length} shorts`);

  await browser.close();

  return videos;
};

module.exports = { getShortsApi };


module.exports = {
  getShorts,
  postData,
  getTwitter,
  getShortsApi
};
