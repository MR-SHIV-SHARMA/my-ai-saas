"use client";
import React, { useState, useCallback } from "react";
import axios from "axios";
import {
  FiUploadCloud,
  FiCheckCircle,
  FiAlertCircle,
  FiDownload,
} from "react-icons/fi";

function VideoUpload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [videoUrls, setVideoUrls] = useState(null); // Store original & compressed video URLs
  const [uploadProgress, setUploadProgress] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(null);

  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      setFile(droppedFile);
      setOriginalSize((droppedFile.size / 1024 / 1024).toFixed(2)); // Store original size in MB
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setVideoUrls(null);

    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("File size too large. Maximum allowed is 70 MB.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const response = await axios.post("/api/video-upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (response.status === 200) {
        setSuccessMessage("Video uploaded successfully!");
        setVideoUrls({
          original: response.data.originalUrl,
          compressed: response.data.compressedUrl,
        });

        // Get compressed file size
        const compressedResponse = await axios.head(
          response.data.compressedUrl
        );
        const compressedFileSize = compressedResponse.headers["content-length"];
        setCompressedSize((compressedFileSize / 1024 / 1024).toFixed(2)); // Convert to MB
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      setErrorMessage("Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Video Optimizer
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Upload and get an optimized version instantly!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Video Title"
            required
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />

          <div
            className="border-2 border-dashed p-6 text-center cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <FiUploadCloud className="text-4xl text-blue-600 mx-auto" />
            <p className="text-gray-600">
              {file ? file.name : "Drag & drop or click to upload"}
            </p>
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/x-msvideo"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                if (e.target.files[0]) {
                  setOriginalSize(
                    (e.target.files[0].size / 1024 / 1024).toFixed(2)
                  );
                }
              }}
              className="hidden"
            />
          </div>

          {file && (
            <p className="text-gray-700 text-sm">
              File: {file.name} ({originalSize} MB)
            </p>
          )}

          {isUploading && (
            <div className="relative w-full h-2 bg-gray-300 rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            disabled={isUploading || !file || file.size > MAX_FILE_SIZE}
          >
            {isUploading ? "Uploading..." : "Optimize & Upload"}
          </button>

          {errorMessage && (
            <p className="text-red-600 flex items-center">
              <FiAlertCircle className="mr-2" />
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="text-green-600 flex items-center">
              <FiCheckCircle className="mr-2" />
              {successMessage}
            </p>
          )}
        </form>

        {videoUrls && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Your Videos:
            </h2>

            {/* Compressed Video Preview */}
            <video controls className="w-full mt-4 rounded-md shadow">
              <source src={videoUrls.compressed} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <p className="text-sm mt-2">
              <span className="font-semibold">Original:</span>{" "}
              <a
                href={videoUrls.original}
                target="_blank"
                className="text-blue-600 underline"
              >
                {videoUrls.original}
              </a>
            </p>

            <p className="text-sm">
              <span className="font-semibold">Compressed:</span>{" "}
              <a
                href={videoUrls.compressed}
                target="_blank"
                className="text-blue-600 underline"
              >
                {videoUrls.compressed}
              </a>
            </p>

            {/* File Size Comparison */}
            {compressedSize && (
              <p className="text-sm mt-2 font-semibold text-gray-700">
                Original Size: {originalSize} MB → Compressed Size:{" "}
                {compressedSize} MB
              </p>
            )}

            {/* Download Button */}
            <a
              href={videoUrls.compressed}
              download
              className="mt-4 inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              <FiDownload className="mr-2" />
              Download Compressed Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoUpload;
