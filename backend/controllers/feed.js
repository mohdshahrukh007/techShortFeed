const axios = require("axios");
require("dotenv").config(); // Load .env file
// const { chromium } = require('playwright');

const YOUTUBE_API_KEY = 'AIzaSyBpC_1cf5IWYzDBHGuPocjzKvA-wIGAsZA'///process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

// ✅ Fetch YouTube Shorts
const getShorts = async (req, res) => {
  try {
    const searchQuery = req.query||"javascript";
    const url =
      `https://www.googleapis.com/youtube/v3/search?part=snippet` +
      `&q=${encodeURIComponent(searchQuery)}` +
      `&type=video` +
      `&videoDuration=short` + // ✅ Filter for Shorts
      `&maxResults=50` +
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



//  const { chromium } = require('playwright');

// const getShortViaScrap = async (keyword, limit = 5) => {
//   const browser = await chromium.launch({ headless: false }); // 🔥 Use headless: false for debugging
//   const page = await browser.newPage();

//   const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
//     keyword
//   )}&sp=EgQQARgB`; // Filter for Shorts

//   console.log(`🔎 Searching for: ${keyword}`);
//   await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

//   await page.waitForSelector('ytd-video-renderer');

//   let videos = [];
//   let scrollAttempts = 0;
//   const MAX_SCROLLS = 10; // Increase scroll attempts

//   while (videos.length < limit && scrollAttempts < MAX_SCROLLS) {
//     // ✅ Extract videos
//     const newVideos = await page.evaluate(() => {
//       const videoElements = document.querySelectorAll('ytd-video-renderer');

//       return Array.from(videoElements).map((video) => {
//         const title = video.querySelector('#video-title')?.innerText || 'No title';
//         let url = video.querySelector('#thumbnail')?.href || '';
//         const videoId = url.match(/v=([^&]+)/)?.[1];
//         if (videoId) {
//           url = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1`;
//         }
//         const views = video.querySelector('#metadata-line span')?.innerText || 'No views';
//         const thumbnail = video.querySelector('img')?.src || '';

//         return { videoId, title, url, views, thumbnail };
//       });
//     });

//     // ✅ Add new videos, avoid duplicates
//     for (const video of newVideos) {
//       if (!videos.some(v => v.videoId === video.videoId)) {
//         videos.push(video);
//       }
//       if (videos.length >= limit) break;
//     }

//     if (videos.length >= limit) break;

//     // ✅ Trigger loading by scrolling and simulating interaction
//     console.log(`➡️ Scrolling attempt: ${scrollAttempts + 1}`);
//     await page.mouse.move(100, 100); // 🔥 Helps trigger lazy loading
//     await page.evaluate('window.scrollTo(0, document.documentElement.scrollHeight)');
//     await page.waitForTimeout(1000);

//     scrollAttempts++;
//   }

//   console.log(`✅ Scraped ${videos.length} shorts`);

//   await browser.close();

//   return videos.slice(0, limit);
// };
// const chromium = require('chrome-aws-lambda');
// const puppeteer = require('puppeteer-core');

// const getShortViaScrap = async (keyword, limit = 5) => {
//   let browser;
//   try {
//     // ✅ Fallback to puppeteer executablePath if chromium path is undefined
//     const executablePath =
//       (await chromium.executablePath) || // ✅ Works on Vercel
//       require('puppeteer').executablePath(); // ✅ Works in local dev

//     console.log(`➡️ Using executablePath: ${executablePath}`);

//     browser = await puppeteer.launch({
//       args: chromium.args,
//       defaultViewport: chromium.defaultViewport,
//       executablePath, // ✅ Use fallback if undefined
//       headless: chromium.headless ?? true,
//     });

//     const page = await browser.newPage();

//     const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
//       keyword
//     )}&sp=EgQQARgB`; // Filter for Shorts

//     console.log(`🔎 Searching for: ${keyword}`);
//     await page.goto(searchUrl, { waitUntil: 'networkidle2' });

//     await page.waitForSelector('ytd-video-renderer');

//     let videos = [];
//     let scrollAttempts = 0;
//     const MAX_SCROLLS = 5;

//     while (videos.length < limit && scrollAttempts < MAX_SCROLLS) {
//       const newVideos = await page.evaluate(() => {
//         const videoElements = document.querySelectorAll('ytd-video-renderer');

//         return Array.from(videoElements).map((video) => {
//           const title = video.querySelector('#video-title')?.innerText || 'No title';
//           let url = video.querySelector('#thumbnail')?.href || '';
//           const videoId = url.match(/v=([^&]+)/)?.[1];
//           if (videoId) {
//             url = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1`;
//           }
//           const views = video.querySelector('#metadata-line span')?.innerText || 'No views';
//           const thumbnail = video.querySelector('img')?.src || '';

//           return { videoId, title, url, views, thumbnail };
//         });
//       });

//       for (const video of newVideos) {
//         if (!videos.some(v => v.videoId === video.videoId)) {
//           videos.push(video);
//         }
//         if (videos.length >= limit) break;
//       }

//       if (videos.length >= limit) break;

//       console.log(`➡️ Scrolling attempt: ${scrollAttempts + 1}`);
//       await page.evaluate('window.scrollTo(0, document.documentElement.scrollHeight)');
//       await page.waitForTimeout(500);

//       scrollAttempts++;
//     }

//     console.log(`✅ Scraped ${videos.length} shorts`);
//     return videos.slice(0, limit);
//   } catch (error) {
//     console.error("❌ Error in scraping:", error);
//     throw error;
//   } finally {
//     if (browser) await browser.close();
//   }
// };

// module.exports = { getShortViaScrap };

// const getShorts = async (req, res) => {
//   console.log(req.query);
//   const query = req?.query?.query || "javascript";
//   if (!query) {
//     return res.status(400).json({ error: "Topic is required" });
//   }

//   try {
//     console.log(`➡️ Fetching yt videos for: ${query}`);
//     const videos = await getShortViaScrap(query); // ✅ Properly returning the result
//     res.json({ videos });
//   } catch (error) {
//     console.error("❌ Error fetching yt videos:", error.message);
//     res.status(500).json({ error: "Failed to fetch yt videos" });
//   }
// };
module.exports = { getShorts };

// const getShortViaScrap = async (keyword) => {
//   const browser = await chromium.launch();
//   const page = await browser.newPage();

//   const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
//     keyword
//   )}&sp=EgQQARgB`; // Filter for Shorts

//   console.log(`Searching for: ${keyword}`);
//   await page.goto(searchUrl, { waitUntil: 'networkidle' });

//   await page.waitForSelector('ytd-video-renderer');

//   const videos = await page.evaluate(() => {
//     const videoElements = document.querySelectorAll('ytd-video-renderer');

//     return Array.from(videoElements).map((video) => {
//       const title = video.querySelector('#video-title')?.innerText || 'No title';
//       let url = video.querySelector('#thumbnail')?.href || '';
//       const videoId = url.match(/v=([^&]+)/)?.[1];
//       if (videoId) {
//         url = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1`;
//       }
//       const views = video.querySelector('#metadata-line span')?.innerText || 'No views';
//       const thumbnail = video.querySelector('img')?.src || '';

//       return { videoId, title, url, views, thumbnail };
//     });
//   });

//   console.log(`Scraped ${videos.length} shorts`);

//   await browser.close();

//   return videos;
// };

// module.exports = {
//   getShorts
// };
