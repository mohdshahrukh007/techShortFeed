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
// Define schema & model
const itemSchema = new mongoose.Schema({ data: Object }, { timestamps: true });
const Item = mongoose.model("Item", itemSchema);

app.post("/save", async (req, res) => {
  const saved = await new Item({ data: req.body }).save();
  res.json(saved);
});

app.get("/get", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
