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
  if (!req.context) req.context = {};
  req.context.origin = req.headers.origin || 'unknown';
  next();
};
app.use(setContext);
const sampleRoutes = require("../routes/sampleRoutes");
app.use("/api", sampleRoutes);

app.post("/save", async (req, res) => res.json(await new Item({ data: req.body }).save()));
app.get("/get", async (req, res) => res.json(await Item.find()));
app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
