const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(
  {
    origin:["https://tech-short-5kzi-lzquvq3pn-mohdshahrukh007s-projects.vercel.app/"],
    methods:["POST","GET"],
    credentials:true

  }
));

const setContext = (req, res, next) => {
  if (!req.context) req.context = {};
  next();
};
app.use(setContext);
const sampleRoutes = require("../routes/sampleRoutes");
app.use("https://tech-short-5kzi-lzquvq3pn-mohdshahrukh007s-projects.vercel.app/api", sampleRoutes);
// app.use("/api", sampleRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
