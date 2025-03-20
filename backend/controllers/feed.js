const axios = require("axios");
require("dotenv").config(); // Load .env file
const { chromium } = require("playwright");

const YOUTUBE_API_KEY = "AIzaSyBpC_1cf5IWYzDBHGuPocjzKvA-wIGAsZA"; ///process.env.YOUTUBE_API_KEY;
// const getShorts = async (req, res) => {
//   try {
//     // ✅ Added a default value for searchQuery
//     const searchQuery = req?.query?.query;
//     const url =
//       `https://www.googleapis.com/youtube/v3/search?part=snippet` +
//       `&q=${encodeURIComponent(searchQuery)}` +
//       `&type=video` +
//       `&videoDuration=short` +
//       `&maxResults=20` +
//       `&videoDefinition=high` +
//       `&order=relevance` +
//       `&safeSearch=moderate` +
//       `&relevanceLanguage=en` +
//       `&regionCode=US` +
//       `&videoEmbeddable=true` +
//       `&key=${YOUTUBE_API_KEY}`;
//     const response = await axios.get(url);
//     const videos = response.data.items.map((video) => ({
//       kind: video.kind,
//       videoId: video.id.videoId,
//       title: video.snippet.title,
//       description: video.snippet.description,
//       thumbnail: video.snippet.thumbnails.high.url,
//       channelTitle: video.snippet.channelTitle,
//       publishedAt: video.snippet.publishedAt,
//       liveBroadcastContent: video.snippet.liveBroadcastContent,
//     }));
//     // ✅ Use mock data if no results are found
//     console.log("API DATA");
//     res.status(200).json(videos);
//   } catch (error) {
//     console.log("No videos found, using mock data...");
//     res.status(200).json([
//       {
//         kind: "youtube#searchResult",
//         videoId: "TBIjgBVFjVI",
//         title: "Front-end web development is changing, quickly",
//         description:
//           "Let's take a first look at that latest release of shadcn/ui and combine it with Vercel's V0 tool - an AI tool for building front-end UIs on ...",
//         thumbnail: "https://i.ytimg.com/vi/TBIjgBVFjVI/hqdefault.jpg",
//         channelTitle: "Fireship",
//         publishedAt: "2024-09-05T18:54:47Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "NZBxq42VJMg",
//         title:
//           "&quot;They don&#39;t use any front-end frameworks!&quot; @ThePrimeagen reacts to our fast site speed on stream",
//         description:
//           "For many websites and web applications, using JavaScript and the Web Platform's features is enough to get the job done and ...",
//         thumbnail: "https://i.ytimg.com/vi/NZBxq42VJMg/hqdefault.jpg",
//         channelTitle: "Frontend Masters",
//         publishedAt: "2023-10-24T18:42:58Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "-aBGG3vnDjw",
//         title: "Frontend JavaScript Frameworks Tier List",
//         description:
//           "These are the undeniable rankings for the best frontend javascript frameworks. Let me know which ones I should add in for part 2!",
//         thumbnail: "https://i.ytimg.com/vi/-aBGG3vnDjw/hqdefault.jpg",
//         channelTitle: "Conner Ardman",
//         publishedAt: "2022-11-30T14:47:00Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "h3mpHPNa7v0",
//         title:
//           "Most asked JavaScript Interview Question (1) #frontend #javascript #interview",
//         description:
//           "Most asked JavaScript Interview Question Answer #javascript #reactjs #interview.",
//         thumbnail: "https://i.ytimg.com/vi/h3mpHPNa7v0/hqdefault.jpg",
//         channelTitle: "Dev. Aditya",
//         publishedAt: "2022-12-26T16:20:13Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "QWSoyymrtTQ",
//         title:
//           "Backend Developer Roadmap with Frontend Basics in 30 Seconds #backenddevelopment #webdevelopment",
//         description:
//           "In this quick video, I'll guide you through the essentials to become a Backend Developer in 60 seconds! We'll cover frontend ...",
//         thumbnail: "https://i.ytimg.com/vi/QWSoyymrtTQ/hqdefault.jpg",
//         channelTitle: "Tisfoulla Academy",
//         publishedAt: "2024-09-22T12:39:19Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "HmgLZZV1Ebs",
//         title:
//           "Day 42: Frontend Interview Questions - HTML &amp; CSS Focus #frontend #html #css #interviewprep #coding",
//         description:
//           "Day 42 of our “100 Days Frontend Interview Questions” challenge! In this video, we cover essential HTML and CSS questions ...",
//         thumbnail: "https://i.ytimg.com/vi/HmgLZZV1Ebs/hqdefault.jpg",
//         channelTitle: "DeCodeDev",
//         publishedAt: "2024-09-22T05:02:08Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "CMS-Wz1nn64",
//         title:
//           "Can you do this Interview Question? 👀 #frontend #reactjs #javascript",
//         description:
//           "Full Course - https://youtu.be/sZjlEKbaykc Javascript Interview Questions on closures will be discussed in this video including ...",
//         thumbnail: "https://i.ytimg.com/vi/CMS-Wz1nn64/hqdefault.jpg",
//         channelTitle: "RoadsideCoder",
//         publishedAt: "2024-11-22T16:29:10Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "Y-qCyTmpY8M",
//         title:
//           "Benefits of being developer #webdevelopment #frontend #html #javascript #coding #javascripttricks",
//         description: "",
//         thumbnail: "https://i.ytimg.com/vi/Y-qCyTmpY8M/hqdefault.jpg",
//         channelTitle: "Yashu Developer",
//         publishedAt: "2025-02-13T13:53:04Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "f-_5O9QC2DM",
//         title: "How to Build a Blazing Fast Frontend Website",
//         description:
//           "Build 16 Medium/Hard JavaScript projects for live coding Interview rounds Get it now- https://xplodivity.com/courses/16-js-projects ...",
//         thumbnail: "https://i.ytimg.com/vi/f-_5O9QC2DM/hqdefault.jpg",
//         channelTitle: "xplodivity",
//         publishedAt: "2025-02-14T19:04:59Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "bYIhwrHHo3w",
//         title:
//           "Fast Food App in React Native 🔥 #shorts #reactnative #expo #reactjs #app #ui",
//         description:
//           "expo #reactnative #tailwindcss #javascript #programming #typescript #speedcode #coding #design #appdevelopment #reactjs ...",
//         thumbnail: "https://i.ytimg.com/vi/bYIhwrHHo3w/hqdefault.jpg",
//         channelTitle: "Code With Nomi",
//         publishedAt: "2023-05-28T10:00:28Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "s27wzVFKpHw",
//         title:
//           "Did you build your portfolio? #webdevelopment #frontend #html #javascript #coding #javascripttricks",
//         description:
//           "Link: https://github.com/emmabostian/developer-portfolios?tab=readme-ov-file.",
//         thumbnail: "https://i.ytimg.com/vi/s27wzVFKpHw/hqdefault.jpg",
//         channelTitle: "Yashu Developer",
//         publishedAt: "2025-01-14T14:41:40Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "TOCFjEkxeP4",
//         title:
//           "How Much JavaScript For Frontend Developer | Frontend Developer guide",
//         description:
//           "Best Coding Accessories: 🖥️ Monitor – https://amzn.to/41hdEn5 ⌨️ Foldable Keyboard – https://amzn.to/41xEXL3 🖱️ Mouse ...",
//         thumbnail: "https://i.ytimg.com/vi/TOCFjEkxeP4/hqdefault.jpg",
//         channelTitle: "Deepak Jadiwal",
//         publishedAt: "2023-06-05T06:46:48Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "y5lJHO4KSno",
//         title:
//           "Day6: Method VS Function (Clearing JS Interview) #webdevelopment #frontend #javascript #coding",
//         description:
//           "tags------------ #htmlcss #webdevelopment #frontend #html #css #javascript #coding #htmltricks #cssanimations #csstricks ...",
//         thumbnail: "https://i.ytimg.com/vi/y5lJHO4KSno/hqdefault.jpg",
//         channelTitle: "Yashu Developer",
//         publishedAt: "2025-02-18T14:19:42Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "b7wpMfO59w0",
//         title:
//           "Access localhost website from anywhere #webdevelopment #frontend #javascript #coding",
//         description:
//           "tags------------ #htmlcss #webdevelopment #frontend #html #css #javascript #coding #htmltricks #cssanimations #csstricks ...",
//         thumbnail: "https://i.ytimg.com/vi/b7wpMfO59w0/hqdefault.jpg",
//         channelTitle: "Yashu Developer",
//         publishedAt: "2025-02-01T14:14:10Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "3gLd5B5rj6w",
//         title:
//           "Is your Google account safe? #html #webdevelopment #frontend #javascript #coding #javascripttricks",
//         description: "",
//         thumbnail: "https://i.ytimg.com/vi/3gLd5B5rj6w/hqdefault.jpg",
//         channelTitle: "Yashu Developer",
//         publishedAt: "2025-01-19T15:13:33Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "L__fBIqTUIA",
//         title: "¿Por qué no basta JavaScript para el frontend?",
//         description:
//           "Por qué no basta con saber JavaScript para ser frontend? Descubre en este video qué nuevos conceptos y tecnologías ...",
//         thumbnail: "https://i.ytimg.com/vi/L__fBIqTUIA/hqdefault.jpg",
//         channelTitle: "EDteam",
//         publishedAt: "2024-09-27T18:03:28Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "xvscYGNK_UQ",
//         title:
//           "How to build Logic in Javascript #frontend #reactjs #javascript",
//         description:
//           "Full Video - https://youtu.be/v8d5oo7Xs1Y We will discuss top 10 points to master Javascript, and become a rockstar Developer.",
//         thumbnail: "https://i.ytimg.com/vi/xvscYGNK_UQ/hqdefault.jpg",
//         channelTitle: "RoadsideCoder",
//         publishedAt: "2024-10-05T06:30:20Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "rdgtIpoxTjY",
//         title:
//           "Front-end Masters ✅ #webdevelopment #coding #html #css #javascript #programming #frontend #web #code",
//         description:
//           "front end master front end masters front end masters reddit front end masters algorithms front end masters review front end ...",
//         thumbnail: "https://i.ytimg.com/vi/rdgtIpoxTjY/hqdefault.jpg",
//         channelTitle: "Coder Storm",
//         publishedAt: "2024-07-23T12:46:46Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "D8LnY17UftI",
//         title:
//           "HTML vs CSS in Web Design  #coding #python #htmltutorial #htmlfullcourse #javascript #programming",
//         description:
//           "HTML vs CSS: What's the Difference in Web Design? HTML vs CSS: Which One Controls Web Design? HTML vs CSS: ...",
//         thumbnail: "https://i.ytimg.com/vi/D8LnY17UftI/hqdefault.jpg",
//         channelTitle: "Develop Code Journey",
//         publishedAt: "2025-03-13T03:06:26Z",
//         liveBroadcastContent: "none",
//       },
//       {
//         kind: "youtube#searchResult",
//         videoId: "dz86fpa-RVk",
//         title:
//           "Объёмная карточка на CSS и HTML #frontend #javascript #css #html",
//         description:
//           "tags: javascript, html, css, javascript tutorial, css tutorial, html tutorial, learn javascript, javascript tutorial for beginners, learn css, ...",
//         thumbnail: "https://i.ytimg.com/vi/dz86fpa-RVk/hqdefault.jpg",
//         channelTitle: "Frontend Lab",
//         publishedAt: "2025-02-05T17:39:15Z",
//         liveBroadcastContent: "none",
//       },
//     ]);
//   }
// };
const getVideosFromDB = require("../vService/shortsDataQuery");
const { Short, Video } = require("../models/shorts");

const getShorts = async (req, res) => {
  try {
    const searchQuery = req?.query?.query || "frontend development";
    const url =
      `https://www.googleapis.com/youtube/v3/search?part=snippet` +
      `&q=${encodeURIComponent(searchQuery)}` +
      `&type=video` +
      `&videoDuration=short` +
      `&maxResults=50` +
      `&videoDefinition=high` +
      `&order=relevance` +
      `&safeSearch=moderate` +
      `&relevanceLanguage=en` +
      `&regionCode=US` +
      `&videoEmbeddable=true` +
      `&key=${process.env.YOUTUBE_API_KEY}`;

    const response = await axios.get(url);

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
      await Short.findOneAndUpdate(
        { videoId: video.videoId },
        video,
        { upsert: true, new: true }
      );
    }

    res.status(200).json(videos);
    
  } catch (error) {
      console.log("🔥 Quota exceeded. Fetching data from the database...");

      try {
        // ✅ Fallback to DB
        const videosFromDB = await getVideosFromDB(req?.query?.query);

        if (videosFromDB.length > 0) {
          console.log("✅ Fetched from DB");
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
module.exports = { getShorts, getScrap};
