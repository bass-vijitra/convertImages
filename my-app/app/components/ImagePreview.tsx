"use client";

import React from "react";
import type { ImageFile } from "../types";

interface ImagePreviewProps {
  images: ImageFile[];
  onRemove: (id: string) => void;
  disabled?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImagePreview({
  images,
  onRemove,
  disabled = false,
}: ImagePreviewProps) {
  if (images.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
        Preview ({images.length} {images.length === 1 ? "image" : "images"})
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {images.map((img) => (
          <div
            key={img.id}
            className="group relative rounded-xl overflow-hidden bg-zinc-800/60 border border-zinc-700/50 transition-all duration-200 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5"
          >
            {/* Thumbnail */}
            <div className="aspect-square relative overflow-hidden">
              <img
                src={img.preview}
                alt={img.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Remove button */}
              {!disabled && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(img.id);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-zinc-300 hover:bg-red-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  title="Remove image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Info bar */}
            <div className="p-2">
              <p className="text-xs text-zinc-300 truncate font-medium">
                {img.name}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {formatFileSize(img.size)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
