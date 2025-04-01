import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Video from "../../../models/Video";

export async function GET() {
  try {
    await dbConnect();
    const videos = await Video.find().sort({ createdAt: -1 }); // Fetch videos sorted by latest
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching videos" },
      { status: 500 }
    );
  }
}
