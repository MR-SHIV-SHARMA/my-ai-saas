import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const socialFormats = [
  { name: "instagram_square", width: 1080, height: 1080 },
  { name: "instagram_portrait", width: 1080, height: 1350 },
  { name: "twitter_post", width: 1200, height: 675 },
  { name: "twitter_header", width: 1500, height: 500 },
  { name: "facebook_cover", width: 820, height: 312 },
];

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      console.log("❌ No file found in request.");
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const eagerTransforms = socialFormats.map((format) => ({
      width: format.width,
      height: format.height,
      crop: "fill",
      gravity: "auto",
      format: "png",
      transformation: [{ quality: "auto" }],
    }));

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "next-cloudinary-uploads",
          resource_type: "image",
          eager: eagerTransforms, // 💥 All formats will be created during upload
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    console.log("✅ Upload Result from Cloudinary:");
    console.log("Public ID:", result.public_id);
    console.log("URL:", result.secure_url);
    console.log("Width x Height:", result.width, "x", result.height);
    console.log("Eager URLs:");
    result.eager?.forEach((eager, index) => {
      console.log(` - ${socialFormats[index].name}: ${eager.secure_url}`);
    });

    return NextResponse.json(
      {
        publicId: result.public_id,
        eager: result.eager?.map((e, index) => ({
          format: socialFormats[index].name,
          url: e.secure_url,
        })),
        url: result.secure_url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("❌ Upload image failed:", error);
    return NextResponse.json({ error: "Upload image failed" }, { status: 500 });
  }
}
