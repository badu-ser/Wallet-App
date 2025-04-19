import express from 'express';
import Visit from '../models/visit.model.js';

const router = express.Router();

router.post('/track', async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  await Visit.updateOne({ date: today }, { $inc: { count: 1 } }, { upsert: true });
  res.sendStatus(200);
});

router.get('/history', async (req, res) => {
  const history = await Visit.find().sort({ date: 1 });
  const total = history.reduce((sum, entry) => sum + entry.count, 0);
  res.json({ total, history });
});

export default router;
