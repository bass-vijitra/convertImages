"use client";

import React from "react";

interface ConvertButtonProps {
  onConvert: () => void;
  onDownload: () => void;
  imageCount: number;
  isConverting: boolean;
  isComplete: boolean;
  successCount: number;
}

export default function ConvertButton({
  onConvert,
  onDownload,
  imageCount,
  isConverting,
  isComplete,
  successCount,
}: ConvertButtonProps) {
  if (imageCount === 0) return null;

  // After conversion is done and there are successful conversions → show Download button
  if (isComplete && successCount > 0) {
    return (
      <button
        onClick={onDownload}
        className="
          w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-base
          bg-gradient-to-r from-emerald-500 to-teal-500
          text-white shadow-lg shadow-emerald-500/25
          hover:shadow-emerald-500/40 hover:scale-[1.02]
          active:scale-[0.98]
          transition-all duration-200
          flex items-center justify-center gap-2
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Download ({successCount} {successCount === 1 ? "file" : "files"})
      </button>
    );
  }

  // Converting state → show spinner
  if (isConverting) {
    return (
      <button
        disabled
        className="
          w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-base
          bg-gradient-to-r from-purple-600 to-blue-600
          text-white/80 shadow-lg
          opacity-80 cursor-not-allowed
          flex items-center justify-center gap-3
        "
      >
        <svg
          className="animate-spin w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        Converting...
      </button>
    );
  }

  // Default → Convert button
  return (
    <button
      onClick={onConvert}
      className="
        w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-base
        bg-gradient-to-r from-purple-600 to-blue-600
        text-white shadow-lg shadow-purple-500/25
        hover:shadow-purple-500/40 hover:scale-[1.02]
        active:scale-[0.98]
        transition-all duration-200
        flex items-center justify-center gap-2
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
        />
      </svg>
      Convert to WebP ({imageCount} {imageCount === 1 ? "image" : "images"})
    </button>
  );
}
