const axios = require("axios");
require("dotenv").config(); // Load .env file
// List of YouTube API keys
const YOUTUBE_API_KEYS = [
  "AIzaSyDwRdSOdeXHLNJZszerfYGfgQmS0NwVnqg",
  "AIzaSyCrV-l4SSpFQH6NykCWSABMsXpJ5zsYqpA",
  "AIzaSyAa-roHueJmhR7Ii7IIiPSHDYnopthNxJc",
];
const searchShorts = require("../vService/shortsDataQuery");
const { Short } = require("../models/shorts");
let searchCatagory = null;
let filterType = null;
let youtubeSearchQuery = null;

let currentKeyIndex = 0; // Start with the first API key
// Function to get the current API key
const getCurrentApiKey = () => YOUTUBE_API_KEYS[currentKeyIndex];

// Function to rotate to the next API key
const rotateApiKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % YOUTUBE_API_KEYS.length;
};

getYoutubeData = async (req, res) => {
  youtubeSearchQuery = req?.body?.query;
  filterType = req?.body?.filter;
  searchCatagory = req?.body?.data;
      const apiKey = getCurrentApiKey();
      console.log("Using API key:", apiKey);
      const url =
      `https://www.googleapis.com/youtube/v3/search?part=snippet` +
      `&q=${encodeURIComponent(youtubeSearchQuery)}` +
      `&type=video` +
      `&videoDuration=short` +
      `&maxResults=20` +
      `&videoDefinition=high` +
      `&order=relevance` +
      `&safeSearch=moderate` +
      `&relevanceLanguage=en` +
      `&regionCode=US` +
      `&videoEmbeddable=true` +
      `&key=${apiKey}`;
      // `https://www.googleapis.com/youtube/v3/search?part=snippet` +
      // `&q=${encodeURIComponent(youtubeSearchQuery)}` +
      // `&type=video` +
      // `&videoDuration=short` +
      // `&maxResults=20` +
      // `&videoDefinition=high` +
      // `&order=date` +  
      // `&safeSearch=moderate` +
      // `&relevanceLanguage=en` +
      // `&regionCode=US` +
      // `&videoEmbeddable=true` +
      // `&key=${apiKey}`;

    let response = await axios.get(url);
    // Validate and map the response
    console.log("Response status:", response);
    const videos = response.data.items.map((video) => ({
      videoId: video?.id?.videoId || null,
      title: video?.snippet?.title || "No title",
      description: video?.snippet?.description || "No description",
      thumbnail: video?.snippet?.thumbnails?.high?.url || "",
      channelTitle: video?.snippet?.channelTitle || "Unknown channel",
      publishedAt: video?.snippet?.publishedAt || "Unknown date",
      liveBroadcastContent: video?.snippet?.liveBroadcastContent || "none",
    }));

    // Save videos to the database
    for (const video of videos) {
      // if (!video.videoId) {
      //   console.warn("Skipping video with missing videoId:", video);
      //   continue;
      // }
      // await Short.findOneAndUpdate(
      //   { videoId: video.videoId },
      //   {
      //     title: video.title,
      //     description: video.description,
      //     thumbnailUrl: video.thumbnail,
      //     videoId: video.videoId,
      //     publishedAt: video.publishedAt,
      //     channelTitle: video.channelTitle,
      //     source: "youtube",
      //     searchQuery: searchCatagory,
      //     filter: filterType,
      //   },
      //   {
      //     upsert: true,
      //     new: true,
      //   }
      // );
}
return videos;

}

const getShorts = async (req, res) => {
  try{
    let v = await getYoutubeData(req, res)
    res.status(200).json(v);
} catch (error) {

  rotateApiKey();
    console.error(
      "🔥 Quota exceeded or API error:",
      error.message,
      "Fetching data from the database..."
    );

    try {
      // Fallback to DB
      const videosFromDB = await searchShorts(searchCatagory);
      console.log("Fallback data from DB:", videosFromDB.length);

      for (const video of videosFromDB) {
        if (!video.videoId) {
          // console.warn("Skipping video with missing videoId from DB:", video);
          continue;
        }

        // await Short.findOneAndUpdate(
        //   { youtubeVideoId: video.videoId },
        //   {
        //     title: video?.title,
        //     description: video.description,
        //     thumbnailUrl: video.thumbnails?.high?.url || "",
        //     youtubeVideoId: video.videoId,
        //     publishedAt: video.publishedAt,
        //     channelTitle: video.channelTitle,
        //     source: "youtube",
        //     searchQuery: searchCatagory,
        //     filter: filterType,
        //   }
        // );
      }

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

const getReddit = async (req, res) => {
  const keyword = req.query || "javascript";
  const limit = parseInt(req.query.limit) || 2000;
  const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(
    keyword
  )}&type=link&sort=relevance&limit=${limit}&restrict_sr=on&t=all&raw_json=1`;
  try {
    const response = await axios.get(url);
    res.status(200).json({ data: response.data.data });
  } catch (error) {
    console.error("❌ Error fetching Reddit data:", error.message);
    res.status(500).json({ error: "Failed to fetch Reddit data" });
  }
};
module.exports = { getShorts, getScrap, getReddit };
