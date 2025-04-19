import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  date: { type: String, required: true },
  count: { type: Number, default: 1 }
});

const Visit = mongoose.model('Visit', visitSchema);
export default Visit;
