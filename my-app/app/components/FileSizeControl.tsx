"use client";

import React from "react";
import type { ImageFile } from "../types";

const MIN_SIZE_KB = 85;
const MAX_SIZE_KB = 300;

interface FileSizeControlProps {
  images: ImageFile[];
  onSetAllMin: () => void;
  onSetAllMax: () => void;
  onSetTargetSize: (id: string, sizeKB: number) => void;
  disabled?: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export default function FileSizeControl({
  images,
  onSetAllMin,
  onSetAllMax,
  onSetTargetSize,
  disabled = false,
}: FileSizeControlProps) {
  if (images.length === 0) return null;

  return (
    <div className="w-full mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Target File Size
          </h3>
          <span
            className="group relative cursor-help"
            title="Set the desired output file size for each image (85–300 KB). The converter will adjust quality to match."
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-zinc-500 hover:text-zinc-300 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            {/* Tooltip */}
            <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 rounded-lg bg-zinc-700 px-3 py-2 text-xs text-zinc-200 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 z-50">
              Adjust the output file size for each image. Range: 85–300 KB. The
              converter will iteratively find the best quality to match your
              target.
            </span>
          </span>
        </div>

        {/* Bulk action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSetAllMin}
            disabled={disabled}
            className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:text-blue-400 hover:border-blue-500/40 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Set All to Min ({MIN_SIZE_KB} KB)
          </button>
          <button
            onClick={onSetAllMax}
            disabled={disabled}
            className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:text-purple-400 hover:border-purple-500/40 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Set All to Max ({MAX_SIZE_KB} KB)
          </button>
        </div>
      </div>

      {/* Per-image controls */}
      <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/40 overflow-hidden">
        <ul className="divide-y divide-zinc-700/30">
          {images.map((img, index) => (
            <li
              key={img.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 hover:bg-zinc-700/20 transition-colors duration-200"
            >
              {/* Image name */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="text-xs text-zinc-600 font-mono w-6 text-right shrink-0">
                  {index + 1}
                </span>
                <p className="text-sm text-zinc-200 truncate font-medium">
                  {img.name}
                </p>
              </div>

              {/* Slider + Input */}
              <div className="flex items-center gap-3 shrink-0">
                {/* Range slider */}
                <input
                  type="range"
                  min={MIN_SIZE_KB}
                  max={MAX_SIZE_KB}
                  value={img.targetSizeKB}
                  onChange={(e) =>
                    onSetTargetSize(img.id, parseInt(e.target.value, 10))
                  }
                  disabled={disabled}
                  className="w-24 sm:w-32 h-1.5 accent-purple-500 bg-zinc-700 rounded-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/30 [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-runnable-track]:bg-zinc-700 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:h-1.5
                  "
                />

                {/* Numeric input */}
                <div className="relative">
                  <input
                    type="number"
                    min={MIN_SIZE_KB}
                    max={MAX_SIZE_KB}
                    value={img.targetSizeKB}
                    onChange={(e) => {
                      const raw = parseInt(e.target.value, 10);
                      if (!isNaN(raw)) {
                        onSetTargetSize(img.id, raw);
                      }
                    }}
                    onBlur={(e) => {
                      const raw = parseInt(e.target.value, 10);
                      if (isNaN(raw)) {
                        onSetTargetSize(img.id, MAX_SIZE_KB);
                      } else {
                        onSetTargetSize(img.id, clamp(raw, MIN_SIZE_KB, MAX_SIZE_KB));
                      }
                    }}
                    disabled={disabled}
                    className="w-20 px-2 py-1.5 text-xs text-right text-zinc-200 bg-zinc-900/80 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                    "
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 pointer-events-none">
                    KB
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Range hint */}
      <p className="text-[11px] text-zinc-600 mt-2 text-right">
        Range: {MIN_SIZE_KB} KB - {MAX_SIZE_KB} KB
      </p>
    </div>
  );
}
