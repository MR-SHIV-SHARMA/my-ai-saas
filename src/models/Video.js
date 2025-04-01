import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    publicId: { type: String, required: true }, // Cloudinary public ID
    originalSize: { type: Number, required: true },
    compressedSize: { type: Number, required: true },
    duration: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);
