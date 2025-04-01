import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/lib/dbConnect";
import Video from "@/models/Video";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const description = formData.get("description");
    const originalSize = formData.get("originalSize");

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "next-cloudinary-uploads", resource_type: "video" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const newVideo = new Video({
      title,
      description,
      publicId: result.public_id,
      originalSize,
      compressedSize: result.bytes,
      duration: result.duration,
      createdAt: new Date(),
    });
    await newVideo.save();

    return NextResponse.json({ publicId: result.public_id }, { status: 200 });
  } catch (error) {
    console.log("Upload video failed", error);
    return NextResponse.json({ error: "Upload video failed" }, { status: 500 });
  }
}
