import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  date: { type: String, required: true },
  count: { type: Number, default: 1 }
});

export default mongoose.model('Visit', visitSchema);
