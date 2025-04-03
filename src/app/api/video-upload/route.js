import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// 🛠 Debugging: Console.log Cloudinary Config
console.log("Cloudinary Config:", {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? "********" : "MISSING",
});

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    console.log("📤 Receiving upload request...");

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      console.error("❌ No file found in request.");
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    console.log("📁 File received:", file.name);

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 🛠 Debugging: Verify Cloudinary API Credentials Before Upload
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("❌ Cloudinary credentials are missing!");
      return NextResponse.json(
        { error: "Cloudinary credentials missing" },
        { status: 500 }
      );
    }

    // Upload to Cloudinary directly using Buffer
    console.log("☁ Uploading to Cloudinary...");
    const cloudinaryUpload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "video",
            folder: "uploads",
            eager: [{ width: 720, crop: "scale", format: "mp4" }],
          },
          (error, result) => {
            if (error) {
              console.error("❌ Cloudinary Upload Failed:", error);
              reject(error);
            } else {
              console.log("✅ Upload successful:", result.secure_url);
              resolve(result);
            }
          }
        )
        .end(buffer); // ✅ Buffer directly stream karo
    });

    return NextResponse.json(
      {
        message: "Video uploaded successfully",
        originalUrl: cloudinaryUpload.secure_url,
        compressedUrl: cloudinaryUpload.eager[0].secure_url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Upload video failed:", error);
    return NextResponse.json(
      { error: "Video upload failed. Please try again." },
      { status: 500 }
    );
  }
}
