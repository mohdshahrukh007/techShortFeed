const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*', // Allow any origin
  methods: ["POST", "GET"],
  credentials: true
}));
const connectDB = require('../models/db');
// Connect to MongoDB
connectDB();
// Add this middleware to set a context object on the request
const setContext = (req, res, next) => {
  const allowedOrigins = ['https://tech-short-5kzi.vercel.app']; // Replace with your allowed origin(s)
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    if (!req.context) req.context = {};
    req.context.origin = origin;
  } else {
    req.context = { origin: 'unauthorized' };
  }
  next();
};
app.use(setContext);
const sampleRoutes = require("../routes/sampleRoutes");
app.use("/api", sampleRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
