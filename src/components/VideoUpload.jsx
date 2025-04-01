"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function VideoUpload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message
    setSuccessMessage(""); // Reset success message

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
    formData.append("originalSize", file.size.toString());

    try {
      await axios.post("/api/video-upload", formData);
      setSuccessMessage("Video uploaded successfully!");
      setTimeout(() => {
        router.push("/");
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      setErrorMessage("Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 flex flex-col">
      <header className="bg-white p-4 shadow-md rounded-b-lg">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Video Compression Service
        </h1>
        <p className="text-center text-gray-700">
          Compress your videos effortlessly
        </p>
      </header>
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Upload Your Video
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text text-gray-800">Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 rounded-md transition duration-200 ease-in-out"
                required
                aria-label="Video Title"
                placeholder="Enter video title"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text text-gray-800">Description</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 rounded-md transition duration-200 ease-in-out"
                aria-label="Video Description"
                placeholder="Enter video description"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text text-gray-800">Video File</span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="file-input file-input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 rounded-md transition duration-200 ease-in-out"
                required
                aria-label="Upload Video File"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {file.name} (
                  {(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-transform transform hover:scale-105 shadow-md"
              disabled={isUploading}
            >
              {isUploading ? (
                <span className="loader" aria-hidden="true"></span>
              ) : (
                "Compress and Upload Video"
              )}
            </button>
          </form>
          {errorMessage && (
            <div className="mt-4 text-red-600 text-center">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="mt-4 text-green-600 text-center">
              {successMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoUpload;
