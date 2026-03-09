"use client";

import React from "react";
import type { ImageFile, ConvertStatus } from "../types";

interface ImageListProps {
  images: ImageFile[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function StatusBadge({ status }: { status: ConvertStatus }) {
  const config: Record<
    ConvertStatus,
    { label: string; color: string; icon: string; animate?: boolean }
  > = {
    pending: {
      label: "Pending",
      color: "bg-zinc-600/30 text-zinc-400 border-zinc-600/50",
      icon: "⏳",
    },
    converting: {
      label: "Converting...",
      color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
      icon: "⚙️",
      animate: true,
    },
    success: {
      label: "Success",
      color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      icon: "✓",
    },
    error: {
      label: "Failed",
      color: "bg-red-500/15 text-red-400 border-red-500/30",
      icon: "✗",
    },
  };

  const { label, color, icon, animate } = config[status];

  return (
    <span
      className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
      ${color}
      ${animate ? "animate-pulse" : ""}
    `}
    >
      <span>{icon}</span>
      {label}
    </span>
  );
}

export default function ImageList({ images }: ImageListProps) {
  if (images.length === 0) return null;

  const successCount = images.filter((img) => img.status === "success").length;
  const errorCount = images.filter((img) => img.status === "error").length;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
          Conversion Status
        </h3>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-zinc-500">
            Total: <span className="text-zinc-300 font-semibold">{images.length}</span>
          </span>
          {successCount > 0 && (
            <span className="text-emerald-400">
              ✓ {successCount}
            </span>
          )}
          {errorCount > 0 && (
            <span className="text-red-400">
              ✗ {errorCount}
            </span>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/40 overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar">
        <ul className="divide-y divide-zinc-700/30">
          {images.map((img, index) => (
            <li
              key={img.id}
              className={`
                flex items-center justify-between px-4 py-3
                transition-colors duration-200
                ${img.status === "converting" ? "bg-yellow-500/5" : "hover:bg-zinc-700/20"}
              `}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="text-xs text-zinc-600 font-mono w-6 text-right shrink-0">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-zinc-200 truncate font-medium">
                    {img.name}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {formatFileSize(img.size)}
                    {img.status === "success" && img.convertedBlob && (
                      <span className="text-emerald-500 ml-2">
                        → {formatFileSize(img.convertedBlob.size)} WebP
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <StatusBadge status={img.status} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
