const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const sampleRoutes = require("../routes/sampleRoutes");
app.use("/", sampleRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
