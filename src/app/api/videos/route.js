import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return NextResponse.json({ error: "Public ID required" }, { status: 400 });
    }

    const videoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${publicId}.mp4`;

    return NextResponse.json({ publicId, url: videoUrl }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching video" }, { status: 500 });
  }
}
