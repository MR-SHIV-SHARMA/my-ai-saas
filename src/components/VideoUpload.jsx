"use client";
import React, { useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiUploadCloud, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

function VideoUpload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      setFile(droppedFile);
    }
  }, []);

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
      await axios.post("/api/video-upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      // ... success handling ...
    } catch (error) {
      setErrorMessage("Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Video Optimizer
            </span>
          </h1>
          <p className="text-gray-600">
            Upload and compress videos in MP4, MOV, or AVI format
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="form-group relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input peer"
                placeholder=" "
                required
              />
              <label className="floating-label">Video Title</label>
            </div>

            <div className="form-group relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea peer"
                placeholder=" "
                rows="3"
              />
              <label className="floating-label">Description (optional)</label>
            </div>

            <div
              className={`drop-zone ${isDragging ? "drag-active" : ""} ${
                errorMessage ? "border-error" : ""
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="drop-content">
                <FiUploadCloud className="text-4xl text-blue-600 mb-4" />
                <p className="text-gray-600 mb-2">
                  {file
                    ? file.name
                    : "Drag & drop video file or click to browse"}
                </p>
                <p className="text-sm text-gray-500">
                  Max file size: 70MB • Supported formats: MP4, MOV, AVI
                </p>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/x-msvideo"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors"
                >
                  Browse Files
                </label>
              </div>
            </div>

            {file && (
              <div className="file-info animate-fade-in">
                <div className="flex justify-between items-center">
                  <span className="truncate">{file.name}</span>
                  <span className="text-sm">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                {file.size > MAX_FILE_SIZE && (
                  <div className="text-red-600 text-sm mt-1 flex items-center">
                    <FiAlertCircle className="mr-2" />
                    File exceeds maximum size limit
                  </div>
                )}
              </div>
            )}
          </div>

          {isUploading && (
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={isUploading || !file || file.size > MAX_FILE_SIZE}
          >
            {isUploading ? (
              <div className="flex items-center justify-center">
                <div className="loader"></div>
                <span className="ml-2">Processing...</span>
              </div>
            ) : (
              "Optimize & Upload"
            )}
          </button>

          {errorMessage && (
            <div className="status-message error">
              <FiAlertCircle className="mr-2" />
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="status-message success">
              <FiCheckCircle className="mr-2" />
              {successMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default VideoUpload;
