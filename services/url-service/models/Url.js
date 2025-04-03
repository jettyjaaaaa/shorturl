import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  fullUrl: String,
  code: String,
  shortUrl: String,
  expiresAt: Date,
}, {
  timestamps: true 
});

export default mongoose.model('Url', urlSchema);
