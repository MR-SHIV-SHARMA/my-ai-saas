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
  { name: "instagram_story", width: 1080, height: 1920 },
  { name: "facebook_post", width: 1200, height: 630 },
  { name: "facebook_cover", width: 820, height: 312 },
  { name: "facebook_story", width: 1080, height: 1920 },
  { name: "twitter_post", width: 1200, height: 675 },
  { name: "twitter_header", width: 1500, height: 500 },
  { name: "linkedin_post", width: 1200, height: 627 },
  { name: "linkedin_banner", width: 1584, height: 396 },
  { name: "youtube_thumbnail", width: 1280, height: 720 },
  { name: "youtube_channel_banner", width: 2560, height: 1440 },
  { name: "pinterest_pin", width: 1000, height: 1500 },
  { name: "snapchat_story", width: 1080, height: 1920 },
  { name: "tiktok_video_cover", width: 1080, height: 1920 },
  { name: "threads_post", width: 1080, height: 1350 },
  { name: "reddit_banner", width: 1920, height: 384 },
  { name: "tumblr_graphic", width: 1280, height: 720 },
  { name: "whatsapp_status", width: 1080, height: 1920 },
  { name: "medium_post_image", width: 1200, height: 900 },
];

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
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
          eager: eagerTransforms,
          tags: ["auto-delete-10min"],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
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
    return NextResponse.json({ error: "Upload image failed" }, { status: 500 });
  }
}
