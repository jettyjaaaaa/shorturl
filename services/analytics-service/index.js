//analytics-service/index.js

const express = require("express");
const mongoose = require("mongoose");
const Click = require("./models/Click");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/analytics");

// POST /track/:code → track click
app.post("/track/:code", async (req, res) => {
  const { ip, userAgent } = req.body;

  await Click.create({
    shortCode: req.params.code,
    ip,
    userAgent,
  });

  res.json({ status: "tracked" });
});

// GET /stats/:code → view stats
app.get("/stats/:code", async (req, res) => {
  const clicks = await Click.find({ shortCode: req.params.code }).sort({ timestamp: -1 });
  res.json({
    totalClicks: clicks.length,
    history: clicks,
  });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Analytics service running on ${PORT}`));
