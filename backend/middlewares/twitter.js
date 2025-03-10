

export const scrapeTwitterVideos = async (topic) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log(`🔎 Searching for topic: ${topic}`);

    const searchUrl = `https://twitter.com/search?q=${encodeURIComponent(topic)}&f=live`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    let videoUrls = new Set();
    let lastHeight = await page.evaluate('document.body.scrollHeight');
    let scrollCount = 0;
    const MAX_SCROLLS = 10;

    while (scrollCount < MAX_SCROLLS) {
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForTimeout(2000);

      const urls = await page.evaluate(() => {
        const videos = document.querySelectorAll('video');
        return Array.from(videos).map(video => video.src).filter(src => src);
      });

      urls.forEach(url => videoUrls.add(url));

      let newHeight = await page.evaluate('document.body.scrollHeight');
      if (newHeight === lastHeight) break;

      lastHeight = newHeight;
      scrollCount++;
    }

    await browser.close();
    return Array.from(videoUrls);
  } catch (error) {
    console.error('❌ Error scraping Twitter:', error.message);
    await browser.close();
    throw error;
  }
};

// // ✅ Create an endpoint to get videos
// app.get('/search', async (req, res) => {
//   const topic = req.query.topic;
//   if (!topic) {
//     return res.status(400).json({ error: 'Topic is required' });
//   }

//   try {
//     console.log(`➡️ Fetching videos for: ${topic}`);
//     const videos = await scrapeTwitterVideos(topic);
//     res.json({ videos });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch videos' });
//   }
// });
 