import express from 'express';
import Url from '../models/Url.js';

const router = express.Router();

router.get('/history', async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
