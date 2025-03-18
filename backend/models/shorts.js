const mongoose = require("mongoose");

const shortSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  thumbnail: String,
  channelTitle: String,
  publishedAt: Date,
  liveBroadcastContent: String,
});

const Short = mongoose.model("Short", shortSchema);
 

// Define schema
const videoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  description: String,
  thumbnail: String,
  channelTitle: String,
  publishedAt: Date,
});

const Video = mongoose.model("Video", videoSchema);

// ✅ Function to fetch from database
const getVideosFromDB = async (query) => {
  try {
    // Search for matching videos in DB
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(20);

    return videos;
  } catch (error) {
    console.error("❌ Database Error:", error);
    throw error;
  }
};


module.exports = { Short,getVideosFromDB };
