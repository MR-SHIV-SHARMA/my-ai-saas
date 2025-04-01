import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  publicId: { type: String, required: true },
  originalSize: { type: Number, required: true },
  compressedSize: { type: Number },
  duration: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);
