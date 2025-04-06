"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-background">
        <Loader2 className="animate-spin text-white w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-background px-4 relative overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md z-0" />

      <div className="max-w-xl w-full text-center z-10">
        <h1 className="text-4xl font-extrabold text-white drop-shadow mb-8">
          🎬 Media Toolkit
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/social-share">
            <div className="bg-white/80 shadow-lg hover:shadow-2xl transition duration-300 rounded-2xl p-6 border border-white/40 backdrop-blur-sm cursor-pointer">
              <h2 className="text-lg font-semibold text-blue-600 mb-2">
                📸 Social Share
              </h2>
              <p className="text-sm text-gray-700">
                Upload and format images for Instagram, Facebook, and more.
              </p>
            </div>
          </Link>

          <Link href="/video-upload">
            <div className="bg-white/80 shadow-lg hover:shadow-2xl transition duration-300 rounded-2xl p-6 border border-white/40 backdrop-blur-sm cursor-pointer">
              <h2 className="text-lg font-semibold text-green-600 mb-2">
                🎥 Video Upload
              </h2>
              <p className="text-sm text-gray-700">
                Upload and compress videos optimized for web and social use.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
