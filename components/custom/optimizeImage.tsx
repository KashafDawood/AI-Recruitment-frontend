"use client";

import React, { useState, useMemo } from "react";
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
  backgroundColor?: string;
}

// Function to generate a consistent color based on string input
const generateColorFromString = (str: string): string => {
  // Default to a simple string if none provided
  const inputString = str || "default";
  let hash = 0;

  // Generate a hash from the string
  for (let i = 0; i < inputString.length; i++) {
    hash = inputString.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert to hex color with moderate saturation and lightness
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    // Ensure colors aren't too dark or too light
    const adjustedValue = Math.min(Math.max(value, 100), 200);
    color += adjustedValue.toString(16).padStart(2, "0");
  }

  return color;
};

export default function OptimizeImage({
  src,
  alt,
  width,
  height,
  cloudName,
  fallback,
  showFallbackOnError = true,
  backgroundColor,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const cloudinaryName =
    cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Generate a random but consistent background color based on alt text
  const randomColor = useMemo(() => generateColorFromString(alt), [alt]);
  // Use provided backgroundColor, or random color if none provided
  const bgColor = backgroundColor || randomColor;

  // Create default fallback if none provided
  const defaultFallback = fallback ? (
    fallback
  ) : (
    <div
      className="flex items-center justify-center w-full h-full"
      style={{ backgroundColor: bgColor }}
    >
      <AvatarFallback className="w-full h-full flex items-center justify-center">
        {alt?.charAt(0)?.toUpperCase() || "U"}
      </AvatarFallback>
    </div>
  );

  // Show fallback if source is missing or there was an error loading the image
  if (!src || imageError) {
    return showFallbackOnError ? defaultFallback : null;
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
      crop="fill"
      gravity="center"
    />
  );
}
