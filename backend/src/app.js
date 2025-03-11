const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const whitelist = [
  '*'
];

app.use(cors(
  {
    origin:["https://tech-short-feed-dyhsgke0j-mohdshahrukh007s-projects.vercel.app/"],
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
app.use("/", sampleRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
