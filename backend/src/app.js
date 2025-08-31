const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Configure CORS to allow the custom 'x-user-id' header
app.use(cors({
  origin: '*', // Allow any origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow all methods used in your API
  allowedHeaders: ["Content-Type", "Authorization", "x-user-id"] // Explicitly allow the custom header
}));
const connectDB = require('../models/db');
// Connect to MongoDB
connectDB();
// Add this middleware to set a context object on the request
const setContext = (req, res, next) => {
  if (!req.context) req.context = {};
  req.context.origin = req.headers.origin || 'unknown';
  next();
};

app.use(setContext);

const sampleRoutes = require("../routes/sampleRoutes");
const invoiceRoutes = require("../routes/invoiceRoutes");
app.use("/api", sampleRoutes);
app.use("/api", invoiceRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
