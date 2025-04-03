//url-service/index.js
import express from "express";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import cors from "cors";
import Url from "./models/Url.js";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/shorturl");

app.post("/shorten", async (req, res) => {
  const { fullUrl, customCode, expiresAt } = req.body;

  const shortCode = customCode || nanoid(6);
  const exists = await Url.findOne({ code: shortCode });
  if (exists) return res.status(400).json({ error: "This alias already exists." });

  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
  console.log(`[POST] /shorten → Generated short URL: ${baseUrl}/s/${shortCode}`);


  const newUrl = await Url.create({
    fullUrl,
    code: shortCode,
    shortUrl: `${baseUrl}/s/${shortCode}`,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
  });

  res.json({
    shortUrl: newUrl.shortUrl,
  });
});


// 🚀 Redirect URL
app.get("/s/:code", async (req, res) => {
  const url = await Url.findOne({ code: req.params.code });
  if (!url) return res.status(404).send("URL not found");

  if (url.expiresAt && url.expiresAt < new Date()) {
    return res.status(410).send("Link expired");
  }

  // 🔍 ส่งข้อมูลไป analytics-service
  try {
    await axios.post(`http://analytics-service:5002/track/${req.params.code}`, {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });
  } catch (e) {
    console.log("Analytics tracking failed");
  }

  res.redirect(url.fullUrl);
});

// 📜 GET /history → ส่งข้อมูลทั้งหมดใน MongoDB
app.get("/history", async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/delete/:code", async (req, res) => {
    try {
      await Url.deleteOne({ code: req.params.code });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Delete failed" });
    }
  });
  

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`URL service running on ${PORT}`));
