"use client";

import React, { useState, useCallback } from "react";
import UploadButton from "./components/UploadButton";
import ImagePreview from "./components/ImagePreview";
import ImageList from "./components/ImageList";
import ConvertButton from "./components/ConvertButton";
import AnimatedBorderImage from "./components/AnimatedBorderImage";
import { convertToWebP } from "./utils/imageConverter";
import { generateZipBlob, triggerDownload } from "./utils/zipDownload";
import type { ImageFile } from "./types";

export default function Home() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  // Generate unique ID
  const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  // Handle file selection from UploadButton
  const handleFilesSelected = useCallback(
    (files: File[]) => {
      // Reset completion state when adding new files
      if (isComplete) {
        setIsComplete(false);
        setZipBlob(null);
      }

      const newImages: ImageFile[] = files.map((file) => ({
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        preview: URL.createObjectURL(file),
        status: "pending" as const,
      }));

      setImages((prev) => [...prev, ...newImages]);
    },
    [isComplete]
  );

  // Remove an image from the list
  const handleRemove = useCallback((id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) {
        URL.revokeObjectURL(img.preview);
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  // Convert all images
  const handleConvert = useCallback(async () => {
    setIsConverting(true);
    setIsComplete(false);

    // Reset all statuses to pending
    setImages((prev) =>
      prev.map((img) => ({ ...img, status: "pending" as const, convertedBlob: undefined, errorMessage: undefined }))
    );

    // Process images one by one for clear status tracking
    for (let i = 0; i < images.length; i++) {
      const img = images[i];

      // Set current image to converting
      setImages((prev) =>
        prev.map((item) =>
          item.id === img.id ? { ...item, status: "converting" as const } : item
        )
      );

      try {
        const blob = await convertToWebP(img.file);

        // Set to success
        setImages((prev) =>
          prev.map((item) =>
            item.id === img.id
              ? { ...item, status: "success" as const, convertedBlob: blob }
              : item
          )
        );
      } catch (error) {
        // Set to error
        setImages((prev) =>
          prev.map((item) =>
            item.id === img.id
              ? {
                ...item,
                status: "error" as const,
                errorMessage:
                  error instanceof Error ? error.message : "Unknown error",
              }
              : item
          )
        );
      }
    }

    // Pre-generate ZIP blob so download can be triggered synchronously
    // (Chrome requires link.click() in the same user gesture context)
    const latestImages = await new Promise<ImageFile[]>((resolve) => {
      setImages((prev) => {
        resolve(prev);
        return prev;
      });
    });

    const successFiles = latestImages
      .filter((img) => img.status === "success" && img.convertedBlob)
      .map((img) => ({ name: img.name, blob: img.convertedBlob! }));

    if (successFiles.length > 0) {
      const blob = await generateZipBlob(successFiles);
      setZipBlob(blob);
    }

    setIsConverting(false);
    setIsComplete(true);
  }, [images]);

  // Download pre-generated ZIP — fully synchronous to preserve user gesture context
  const handleDownload = useCallback(() => {
    if (zipBlob) {
      triggerDownload(zipBlob, "converted-images.zip");
    }
  }, [zipBlob]);

  // Clear all images
  const handleClearAll = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setIsComplete(false);
    setZipBlob(null);
  }, [images]);

  const successCount = images.filter((img) => img.status === "success").length;

  return (
    <div className="min-h-screen bg-mesh">
      {/* Header */}
      <header className="w-full border-b border-zinc-800/60 backdrop-blur-sm bg-zinc-950/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Image Converter
              </h1>
              <p className="text-xs text-zinc-500">PNG / JPG → WebP</p>
            </div>
          </div>

          {images.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={isConverting}
              className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-500/40 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Clear All
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero / Upload Section */}
        <div className="mb-10">
          {images.length === 0 && (
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
                Convert Images to{" "}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  WebP
                </span>
              </h2>
              <p className="text-zinc-400 text-base sm:text-lg max-w-lg mx-auto">
                Drop your PNG or JPG images and convert them to optimized WebP
                format.
              </p>
            </div>
          )}

          <UploadButton
            onFilesSelected={handleFilesSelected}
            disabled={isConverting}
          />
        </div>

        {/* Content Area: Preview + Status */}
        {images.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Preview */}
            <div className="flex-1 min-w-0">
              <ImagePreview
                images={images}
                onRemove={handleRemove}
                disabled={isConverting}
              />
            </div>

            {/* Right Column: Status List */}
            <div className="w-full lg:w-[380px] shrink-0">
              <ImageList images={images} />
            </div>
          </div>
        )}

        {/* Convert / Download Button */}
        {images.length > 0 && (
          <div className="mt-8 flex justify-center">
            <ConvertButton
              onConvert={handleConvert}
              onDownload={handleDownload}
              imageCount={images.length}
              isConverting={isConverting}
              isComplete={isComplete}
              successCount={successCount}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800/60 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Spacer for perfect centering on desktop */}
          <div className="hidden sm:block flex-1"></div>

          {/* Centered Text */}
          <div className="flex-1 flex justify-center text-center">
            <p className="text-xs text-zinc-600">
              All conversions happen locally in your browser. No images are
              uploaded to any server.
            </p>
          </div>

          {/* Right Aligned Image */}
          <div className="flex-1 flex justify-center sm:justify-end">
            <AnimatedBorderImage
              src="/Images/kobecoolkid_converted.jpg"
              alt="Kobe Cool Kid"
              size={100}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
