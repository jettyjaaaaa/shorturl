import express from "express";
import QRCode from "qrcode";
import cors from "cors";

const app = express();
app.use(cors());

const BASE_URL = process.env.BASE_URL || "http://localhost:5001/s";

// GET /qrcode/:code
app.get("/qrcode/:code", async (req, res) => {
  const shortUrl = `${BASE_URL}/${req.params.code}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(shortUrl);
    res.json({ qrCode: qrDataUrl });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`QR service running on ${PORT}`));
