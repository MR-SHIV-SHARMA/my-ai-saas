"use client";

import React, { useState, useEffect, useRef } from "react";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080 },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350 },
  "Instagram Story (9:16)": { width: 1080, height: 1920 },
  "Facebook Post (1.91:1)": { width: 1200, height: 630 },
  "Facebook Cover (205:78)": { width: 820, height: 312 },
  "Facebook Story (9:16)": { width: 1080, height: 1920 },
  "Twitter Post (16:9)": { width: 1200, height: 675 },
  "Twitter Header (3:1)": { width: 1500, height: 500 },
  "LinkedIn Post (1.91:1)": { width: 1200, height: 627 },
  "LinkedIn Banner (4:1)": { width: 1584, height: 396 },
  "YouTube Thumbnail (16:9)": { width: 1280, height: 720 },
  "YouTube Channel Banner (2560x1440)": { width: 2560, height: 1440 },
  "Pinterest Pin (2:3)": { width: 1000, height: 1500 },
  "Snapchat Story (9:16)": { width: 1080, height: 1920 },
  "TikTok Video Cover (9:16)": { width: 1080, height: 1920 },
  "Threads Post (4:5)": { width: 1080, height: 1350 },
  "Reddit Banner (5:1)": { width: 1920, height: 384 },
  "Tumblr Graphic (16:9)": { width: 1280, height: 720 },
  "WhatsApp Status (9:16)": { width: 1080, height: 1920 },
  "Medium Post Image (4:3)": { width: 1200, height: 900 },
};

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(
    "Instagram Square (1:1)"
  );
  const [isUploading, setIsUploading] = useState(false);
  const imageRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.error(error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const getFormattedImageUrl = () => {
    if (!uploadedImage) return null;
    const { width, height } = socialFormats[selectedFormat];
    return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,g_auto/${uploadedImage}.png`;
  };

  const handleDownload = () => {
    const url = getFormattedImageUrl();
    if (!url) return;

    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
        link.click();
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-10">
      <div className="bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl rounded-3xl p-10 max-w-3xl w-full text-white">
        <h1 className="text-5xl font-extrabold text-center mb-8 drop-shadow-md">
          Social Media Image Creator
        </h1>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-3">
            Upload an Image
          </label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="w-full file:px-4 file:py-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 border border-gray-300/30 rounded-md bg-white/20 text-white placeholder-gray-300"
          />
        </div>

        {isUploading && (
          <div className="text-center my-4 text-indigo-400 font-medium animate-pulse">
            Uploading...
          </div>
        )}

        {uploadedImage && (
          <>
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3">
                Select Social Media Format
              </label>
              <select
                className="w-full bg-white/20 text-white border border-gray-300/30 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                {Object.keys(socialFormats).map((format) => (
                  <option key={format} value={format} className="text-black">
                    {format}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative bg-white/10 p-4 rounded-xl shadow-inner border border-white/10 flex justify-center">
              <img
                ref={imageRef}
                src={getFormattedImageUrl()}
                alt="Formatted for social media"
                width={socialFormats[selectedFormat].width}
                height={socialFormats[selectedFormat].height}
                className="rounded-xl shadow-lg"
              />
            </div>

            <div className="flex justify-center mt-8">
              <button
                className="px-6 py-3 text-white font-bold bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all"
                onClick={handleDownload}
              >
                Download for {selectedFormat}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
