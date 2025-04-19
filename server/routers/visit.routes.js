import express from 'express';
import Visit from '../models/visit.model.js';

const router = express.Router();

// Helper to get today's date in IST
function getISTDate() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in ms
  const istTime = new Date(now.getTime() + istOffset);
  return istTime.toISOString().slice(0, 10); // Format: YYYY-MM-DD
}

router.post('/track', async (req, res) => {
  const today = getISTDate();
  await Visit.updateOne({ date: today }, { $inc: { count: 1 } }, { upsert: true });
  res.sendStatus(200);
});

router.get('/history', async (req, res) => {
  const history = await Visit.find().sort({ date: 1 });
  const total = history.reduce((sum, entry) => sum + entry.count, 0);
  res.json({ total, history });
});

export default router;
