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
      console.log("Uploaded Image Public ID:", data.publicId);
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

    const transformedUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,g_auto/${uploadedImage}.png`;

    console.log("Transformed Image URL:", transformedUrl);
    return transformedUrl;
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          Social Media Image Creator
        </h1>

        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Upload an Image
          </label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="file-input text-black file-input-bordered file-input-primary w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {isUploading && (
          <div className="text-center my-4 text-indigo-600 font-medium">
            Uploading...
          </div>
        )}

        {uploadedImage && (
          <>
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Select Social Media Format
              </label>
              <select
                className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                {Object.keys(socialFormats).map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative bg-gray-100 p-4 rounded-md shadow-md flex justify-center">
              <img
                ref={imageRef}
                src={getFormattedImageUrl()}
                alt="Formatted for social media"
                width={socialFormats[selectedFormat].width}
                height={socialFormats[selectedFormat].height}
                className="rounded-md shadow-lg"
                onLoad={() => console.log("Image Loaded")}
              />
            </div>

            <div className="flex justify-center mt-6">
              <button
                className="px-6 py-3 text-white font-bold bg-indigo-600 rounded-md hover:bg-indigo-700 transition-all"
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
