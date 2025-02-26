"use client";

import React, { useState } from "react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { AvatarFallback } from "@/components/ui/avatar";

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  width: number;
  height?: number;
  cloudName?: string;
  fallback?: React.ReactNode;
  showFallbackOnError?: boolean;
}

export default function OptimizeImage({
  src,
  alt,
  width,
  height,
  cloudName,
  fallback,
  showFallbackOnError = true,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const cloudinaryName =
    cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Create default fallback if none provided
  const defaultFallback = (
    <AvatarFallback className="w-full h-full flex items-center justify-center">
      {alt?.charAt(0)?.toUpperCase() || "U"}
    </AvatarFallback>
  );

  const actualFallback = fallback || defaultFallback;

  // Show fallback if source is missing or there was an error loading the image
  if (!src || imageError) {
    return showFallbackOnError ? actualFallback : null;
  }

  if (!cloudinaryName) {
    console.warn(
      "Cloudinary cloud name not found. Falling back to Next.js Image component"
    );
    return (
      <Image
        src={src}
        width={width}
        height={height || width}
        alt={alt || "Image"}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <CldImage
      src={src}
      width={width}
      height={height || width}
      alt={alt || "Image"}
      onError={() => setImageError(true)}
      crop={{
        type: "auto",
        source: true,
      }}
    />
  );
}
