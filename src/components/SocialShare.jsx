"use client";
import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(
    "Instagram Square (1:1)"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    if (uploadedImage) setIsTransforming(true);
  }, [selectedFormat, uploadedImage]);

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

  const handleDownload = () => {
    if (!imageRef.current) return;
    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
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
            className="file-input file-input-bordered file-input-primary w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              {isTransforming && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              )}
              <CldImage
                width={socialFormats[selectedFormat].width}
                height={socialFormats[selectedFormat].height}
                src={uploadedImage}
                sizes="100vw"
                alt="transformed image"
                crop="fill"
                aspectRatio={socialFormats[selectedFormat].aspectRatio}
                gravity="auto"
                ref={imageRef}
                onLoad={() => setIsTransforming(false)}
                className="rounded-md shadow-lg"
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
