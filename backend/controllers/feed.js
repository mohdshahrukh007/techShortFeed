const axios = require("axios");
require("dotenv").config(); // Load .env file
// const { chromium } = require('playwright');

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


// const getShortViaScrapold = async (keyword) => {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   // Construct search URL for Shorts with keyword
//   const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
//     keyword
//   )}&sp=EgQQARgB`; // Filters for Shorts

//   console.log(`Searching for: ${keyword}`);
//   await page.goto(searchUrl, { waitUntil: "networkidle2" });

//   // Wait for the shorts container to load
//   await page.waitForSelector("ytd-video-renderer");

//   // Extract video data
//   const videos = await page.evaluate(() => {
//     const videoElements = document.querySelectorAll("ytd-video-renderer");
  
//     return Array.from(videoElements).map((video) => {
//       const title =
//         video.querySelector("#video-title")?.innerText || "No title";
  
//       // Get the video ID from the watch URL and convert to an embed URL
//       let url = video.querySelector("#thumbnail")?.href || "";
//       const videoId = url.match(/v=([^&]+)/)?.[1];
//       if (videoId) {
//         url = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1`;
//       }
//       const views =
//         video.querySelector("#metadata-line span")?.innerText || "No views";
//       const thumbnail = video.querySelector("img")?.src || "";
  
//       return {
//         videoId,
//         title,
//         url,
//         views,
//         thumbnail,
//       };
//     });
//   });
  

//   console.log(`Scraped ${videos.length} shorts`);

//   await browser.close();

//   return videos;
// };


// const getShorts = async (keyword) => {
//   const browser = await chromium.puppeteer.launch({
//     args: chromium.args,
//     defaultViewport: chromium.defaultViewport,
//     executablePath: await chromium.executablePath,
//     headless: true
//   });

//   const page = await browser.newPage();
//   const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
//     keyword
//   )}&sp=EgQQARgB`;

//   console.log(`Searching for: ${keyword}`);
//   await page.goto(searchUrl, { waitUntil: 'networkidle2' });

//   // Wait for the shorts container to load
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
const { chromium } = require('playwright');

const getShortViaScrap = async (keyword, limit = 5) => {
  const browser = await chromium.launch({ headless: false }); // 🔥 Use headless: false for debugging
  const page = await browser.newPage();

  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    keyword
  )}&sp=EgQQARgB`; // Filter for Shorts

  console.log(`🔎 Searching for: ${keyword}`);
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

  await page.waitForSelector('ytd-video-renderer');

  let videos = [];
  let scrollAttempts = 0;
  const MAX_SCROLLS = 10; // Increase scroll attempts

  while (videos.length < limit && scrollAttempts < MAX_SCROLLS) {
    // ✅ Extract videos
    const newVideos = await page.evaluate(() => {
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

    // ✅ Add new videos, avoid duplicates
    for (const video of newVideos) {
      if (!videos.some(v => v.videoId === video.videoId)) {
        videos.push(video);
      }
      if (videos.length >= limit) break;
    }

    if (videos.length >= limit) break;

    // ✅ Trigger loading by scrolling and simulating interaction
    console.log(`➡️ Scrolling attempt: ${scrollAttempts + 1}`);
    await page.mouse.move(100, 100); // 🔥 Helps trigger lazy loading
    await page.evaluate('window.scrollTo(0, document.documentElement.scrollHeight)');
    await page.waitForTimeout(1000);

    scrollAttempts++;
  }

  console.log(`✅ Scraped ${videos.length} shorts`);

  await browser.close();

  return videos.slice(0, limit);
};






const getShorts = async (req, res) => {
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
