"use client";

import React from "react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  width: number;
  height?: number;
  cloudName?: string;
}

export default function OptimizeImage({
  src,
  alt,
  width,
  height,
  cloudName,
}: OptimizedImageProps) {
  // Check if Cloudinary is properly configured
  const cloudinaryName =
    cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Handle missing src or cloudinary config
  if (!src) {
    return (
      <div
        className="bg-gray-200 flex items-center justify-center"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  if (!cloudinaryName) {
    console.warn(
      "Cloudinary cloud name not found. Falling back to Next.js Image component"
    );
    return <Image src={src} width={width} height={height} alt={alt} />;
  }

  return (
    <CldImage
      src={src}
      width={width}
      height={height || width}
      alt={alt || "Image"}
      crop={{
        type: "auto",
        source: true,
      }}
    />
  );
}
