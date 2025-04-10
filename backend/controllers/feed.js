const axios = require("axios");
require("dotenv").config(); // Load .env file
const { chromium } = require("playwright");

const YOUTUBE_API_KEY = "AIzaSyBpC_1cf5IWYzDBHGuPocjzKvA-wIGAsZA"; ///process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_KEY1 = "AIzaSyB9n2oF3eolmvmtHhqpwxZaQ1i2dZrPwHQ"; ///process.env.YOUTUBE_API_KEY;

const searchShorts = require("../vService/shortsDataQuery");
const { Short, Video } = require("../models/shorts");

const getShorts = async (req, res) => {
  try {
    const searchQuery = req?.query?.query || "frontend development";
    const today = new Date().toISOString();
    const url =
      `https://www.googleapis.com/youtube/v3/search?part=snippet` +
      `&q=${encodeURIComponent(searchQuery)}` +
      `&type=video` +
      `&videoDuration=short` +
      `&maxResults=20` +
      `&videoDefinition=high` +
      `&order=relevance` +
      `&safeSearch=moderate` +
      `&relevanceLanguage=en` +
      `&regionCode=US` +
      `&videoEmbeddable=true` +
      `&key=${YOUTUBE_API_KEY}`;

    const response = await axios.get(url+1);

    const videos = response.data.items.map((video) => ({
      videoId: video.id.videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high.url,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      liveBroadcastContent: video.snippet.liveBroadcastContent,
    }));

    // ✅ Save videos to MongoDB, update if they already exist
    for (const video of videos) {
      await Short.findOneAndUpdate({ videoId: video.videoId }, video, {
        upsert: true,
        new: true,
      });
    }
    console.log("🔥  Fetchinghow data from the YT...");

    res.status(200).json(videos);
  } catch (error) {
    console.log("🔥 Quota exceeded. Fetching data from the database...");

    try {
      // ✅ Fallback to DB
      const videosFromDB = await searchShorts(req?.query?.query);

      if (videosFromDB.length > 0) {
        console.log("✅ Fetched from DB", videosFromDB.length);
        res.status(200).json(videosFromDB);
      } else {
        console.log("❌ No fallback data available in the database.");
        res.status(404).json({ message: "No videos found" });
      }
    } catch (dbError) {
      console.error("❌ Error fetching from database:", dbError.message);
      res.status(500).json({ message: "Failed to load videos" });
    }
  }
};

module.exports = { getShorts };

const getShortsviaScrapCall = async (keyword, limit = 5) => {
  const browser = await chromium.launch({ headless: false }); // 🔥 Use headless: false for debugging
  const page = await browser.newPage();

  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    keyword
  )}&sp=EgQQARgB`; // Filter for Shorts

  console.log(`🔎 Searching for: ${keyword}`);
  await page.goto(searchUrl, { waitUntil: "domcontentloaded" });

  await page.waitForSelector("ytd-video-renderer");

  let videos = [];
  let scrollAttempts = 0;
  const MAX_SCROLLS = 100; // Increase scroll attempts

  while (videos.length < limit && scrollAttempts < MAX_SCROLLS) {
    // ✅ Extract videos
    const newVideos = await page.evaluate(() => {
      const videoElements = document.querySelectorAll("ytd-video-renderer");

      return Array.from(videoElements).map((video) => {
        const title =
          video.querySelector("#video-title")?.innerText || "No title";
        let url = video.querySelector("#thumbnail")?.href || "";
        const videoId = url.match(/v=([^&]+)/)?.[1];
        if (videoId) {
          url = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1`;
        }
        const views =
          video.querySelector("#metadata-line span")?.innerText || "No views";
        const thumbnail = video.querySelector("img")?.src || "";

        return { videoId, title, url, views, thumbnail };
      });
    });

    // ✅ Add new videos, avoid duplicates
    for (const video of newVideos) {
      if (!videos.some((v) => v.videoId === video.videoId)) {
        videos.push(video);
      }
      if (videos.length >= limit) break;
    }

    if (videos.length >= limit) break;

    // ✅ Trigger loading by scrolling and simulating interaction
    console.log(`➡️ Scrolling attempt: ${scrollAttempts + 1}`);
    await page.mouse.move(100, 100); // 🔥 Helps trigger lazy loading
    await page.evaluate(
      "window.scrollTo(0, document.documentElement.scrollHeight)"
    );
    await page.waitForTimeout(1000);

    scrollAttempts++;
  }

  console.log(`✅ Scraped ${videos.length} shorts`);

  await browser.close();

  return videos.slice(0, limit);
};
const getScrap = async (req, res) => {
  console.log(req.query);
  const query = req?.query?.query || "javascript";
  if (!query) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    console.log(`➡️ Fetching yt videos for: ${query}`);
    const videos = await getShortsviaScrapCall(query); // ✅ Properly returning the result
    res.json({ videos });
  } catch (error) {
    console.error("❌ Error fetching yt videos:", error.message);
    res.status(500).json({ error: "Failed to fetch yt videos" });
  }
};
module.exports = { getShorts, getScrap };
