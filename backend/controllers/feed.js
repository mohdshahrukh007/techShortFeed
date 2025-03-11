const axios = require("axios");
const puppeteer = require("puppeteer");
require("dotenv").config(); // Load .env file

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

// ✅ Fetch YouTube Shorts
const getShorts = async (req, res) => {
  try {
    const searchQuery = "javascript";
    const url =
      `https://www.googleapis.com/youtube/v3/search?part=snippet` +
      `&q=${encodeURIComponent(searchQuery)}` +
      `&type=video` +
      `&videoDuration=short` + // ✅ Filter for Shorts
      `&maxResults=10` +
      `&videoDefinition=high` +
      `&order=relevance` +
      `&safeSearch=moderate` +
      `&relevanceLanguage=en` +
      `&regionCode=US` +
      `&videoEmbeddable=true` +
      `&key=${YOUTUBE_API_KEY}`;

    const response = await axios.get(url);
    const videos = response.data.items.map((video) => ({
      title: video.snippet.title,
      videoId: video.id.videoId,
      thumbnail: video.snippet.thumbnails.high.url,
    }));

    console.log(videos);

    res.json({ videos });
  } catch (error) {
    console.log("YOUTUBE_API_KEY:", YOUTUBE_API_KEY);
    console.log("CHANNEL_ID:", CHANNEL_ID);
    console.error("❌ Error fetching YouTube Shorts:", error.message);
    res.status(500).json({ error: "Failed to fetch YouTube Shorts" });
  }
};

// ✅ Handle POST request
const postData = (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) {
    return res.status(400).json({ error: "Name and age are required" });
  }
  res.json({ message: "Data received", data: { name, age } });
};

// ✅ Scrape Twitter Videos using Puppeteer
const getTwitter = async (req, res) => {
  const topic = req.query.topic || "javascript";
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    console.log(`➡️ Fetching Twitter videos for: ${topic}`);
    const videos = await scrapeTwitterVideos(topic);
    res.json({ videos });
  } catch (error) {
    console.error("❌ Error fetching Twitter videos:", error.message);
    res.status(500).json({ error: "Failed to fetch Twitter videos" });
  }
};

// ✅ Twitter Scraper
const scrapeTwitterVideos = async (topic) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    console.log(`🔎 Searching Twitter for: ${topic}`);
    const searchUrl = `https://twitter.com/search?q=${encodeURIComponent(
      topic
    )}&f=live`;

    await page.goto(searchUrl, { waitUntil: "networkidle2" });

    let videoUrls = new Set();
    let lastHeight = await page.evaluate(() => document.body.scrollHeight);
    let scrollCount = 0;
    const MAX_SCROLLS = 1;

    while (scrollCount < MAX_SCROLLS) {
      // ✅ Collect video URLs
      const urls = await page.evaluate(() => {
        const videos = document.querySelectorAll("video");
        return Array.from(videos)
          .map((video) => video.src)
          .filter((src) => src);
      });

      urls.forEach((url) => videoUrls.add(url));

      // ✅ Scroll down
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      // ✅ Wait for page to load (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let newHeight = await page.evaluate(() => document.body.scrollHeight);
      if (newHeight === lastHeight) break;

      lastHeight = newHeight;
      scrollCount++;
    }

    await browser.close();
    return Array.from(videoUrls);
  } catch (error) {
    console.error("❌ Error scraping Twitter:", error.message);
    await browser.close();
    throw error;
  }
};

const getShortViaScrap = async (keyword) => {
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

module.exports = { getShortsApi };


module.exports = {
  getShorts,
  postData,
  getTwitter,
  getShortsApi
};
