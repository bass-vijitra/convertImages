"use client";

import React from "react";

interface AnimatedBorderImageProps {
  src: string;
  alt: string;
  size?: number;
}

export default function AnimatedBorderImage({
  src,
  alt,
  size = 64,
}: AnimatedBorderImageProps) {
  return (
    <div
      className="relative flex items-center justify-center rounded-full"
      style={{ width: size + 8, height: size + 8 }}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-full animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] opacity-70">
        <div className="absolute inset-[2px] rounded-full bg-zinc-950 backdrop-blur-md" />
      </div>

      {/* Colorful glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-30 blur-md" />

      {/* Actual Image */}
      <div
        className="relative rounded-full overflow-hidden border border-zinc-800/50 z-10 bg-zinc-900"
        style={{ width: size, height: size }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
