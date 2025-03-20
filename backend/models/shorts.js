const mongoose = require("mongoose");

// Define schema for Shorts
const shortSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  thumbnail: { type: String, default: "" },
  channelTitle: { type: String, default: "" },
  publishedAt: { type: Date, default: null },
  liveBroadcastContent: { type: String, default: "" },
});

// Define schema for Videos
const videoSchema = new mongoose.Schema({
  videoId: { type: String, unique: true, required: true },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  thumbnail: { type: String, default: "" },
  channelTitle: { type: String, default: "" },
  publishedAt: { type: Date, default: null },
});

// Create models
const Short = mongoose.model("Short", shortSchema);
const Video = mongoose.model("Video", videoSchema);


module.exports = { Short, Video };
