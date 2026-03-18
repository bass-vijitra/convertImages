"use client";

import React, { useState } from "react";
import type { ImageFile } from "../types";

const MIN_SIZE_KB = 85;
const MAX_SIZE_KB = 300;

interface FileSizeControlProps {
  images: ImageFile[];
  onSetAllCustom: (sizeKB: number) => void;
  onSetTargetSize: (id: string, sizeKB: number) => void;
  disabled?: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export default function FileSizeControl({
  images,
  onSetAllCustom,
  onSetTargetSize,
  disabled = false,
}: FileSizeControlProps) {
  const [customValue, setCustomValue] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>("");

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
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Presets Dropdown */}
          <div className="relative">
            <select
              value={selectedPreset}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedPreset(val);
                if (val) {
                  onSetAllCustom(parseInt(val, 10));
                }
              }}
              disabled={disabled}
              className="appearance-none text-xs px-3 py-1.5 pr-8 rounded-lg border border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:border-purple-500/40 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <option value="" disabled hidden>
                Quick Presets...
              </option>
              <option value="85">85 KB (Min Size)</option>
              <option value="100">100 KB</option>
              <option value="200">200 KB</option>
              <option value="300">300 KB (Max Quality)</option>
            </select>
            {/* Custom chevron for the select */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Custom value button / input */}
          {!showCustomInput ? (
            <button
              onClick={() => {
                setShowCustomInput(true);
                setCustomError(null);
              }}
              disabled={disabled}
              className="text-xs px-3 py-1.5 rounded-lg border border-dashed border-zinc-600 bg-zinc-800/40 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/40 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Set All Custom
            </button>
          ) : (
            <div className="flex flex-col gap-1.5 items-start mt-2 w-full sm:w-auto sm:mt-0 sm:flex-row sm:items-center">
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <input
                    type="number"
                    min={MIN_SIZE_KB}
                    max={MAX_SIZE_KB}
                    value={customValue}
                    onChange={(e) => {
                      const valStr = e.target.value;
                      setCustomValue(valStr);
                      if (valStr.trim() === "") {
                        setCustomError(null);
                        return;
                      }
                      const valNum = parseInt(valStr, 10);
                      if (isNaN(valNum) || valNum < MIN_SIZE_KB || valNum > MAX_SIZE_KB) {
                        setCustomError(`Please enter a value between ${MIN_SIZE_KB} and ${MAX_SIZE_KB}`);
                      } else {
                        setCustomError(null);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !customError) {
                        const val = parseInt(customValue, 10);
                        if (!isNaN(val)) {
                          onSetAllCustom(clamp(val, MIN_SIZE_KB, MAX_SIZE_KB));
                          setShowCustomInput(false);
                          setCustomValue("");
                          setCustomError(null);
                        }
                      } else if (e.key === "Escape") {
                        setShowCustomInput(false);
                        setCustomValue("");
                        setCustomError(null);
                      }
                    }}
                    autoFocus
                    placeholder={`${MIN_SIZE_KB}-${MAX_SIZE_KB}`}
                    disabled={disabled}
                    className={`w-24 pl-2 pr-2 py-1 text-xs text-center text-zinc-200 bg-zinc-900/80 border rounded-lg focus:outline-none transition-all duration-200
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                      ${customError ? "border-red-500/50 focus:ring-1 focus:ring-red-500/30" : "border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"}
                    `}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 pointer-events-none">
                    KB
                  </span>
                </div>
                <button
                  onClick={() => {
                    const val = parseInt(customValue, 10);
                    if (!isNaN(val) && !customError) {
                      onSetAllCustom(clamp(val, MIN_SIZE_KB, MAX_SIZE_KB));
                      setShowCustomInput(false);
                      setCustomValue("");
                      setCustomError(null);
                    }
                  }}
                  disabled={disabled || !!customError || customValue.trim() === ""}
                  className="text-xs px-2.5 py-1 rounded-lg bg-emerald-600/80 text-white hover:bg-emerald-500 transition-all duration-200 disabled:opacity-40 disabled:hover:bg-emerald-600/80"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomValue("");
                    setCustomError(null);
                  }}
                  className="text-xs px-1.5 py-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  ✕
                </button>
              </div>
              {customError && (
                <span className="text-[10px] text-red-400 sm:ml-2 animate-in fade-in slide-in-from-left-2 duration-200">
                  {customError}
                </span>
              )}
            </div>
          )}
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
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/30 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:-mt-[4px]
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
                    className="w-20 py-1.5 text-xs text-center text-zinc-200 bg-zinc-900/80 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
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
