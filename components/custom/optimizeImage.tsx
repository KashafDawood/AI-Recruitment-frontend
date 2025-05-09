"use client";

import React, { useState } from "react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  width: number;
  height?: number;
  className?: string;
  fallback?: React.ReactNode;
  showFallbackOnError?: boolean;
  backgroundColor?: string;
}

// Function to generate a consistent color based on string input
const generateColorFromString = (str: string): string => {
  const inputString = str || "default";
  let hash = 0;

  for (let i = 0; i < inputString.length; i++) {
    hash = inputString.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    const adjustedValue = Math.min(Math.max(value, 100), 200);
    color += adjustedValue.toString(16).padStart(2, "0");
  }

  return color;
};

export default function OptimizeImage({
  src,
  alt,
  width,
  height = width,
  className = "",
  fallback,
  showFallbackOnError = true,
  backgroundColor,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Use provided backgroundColor, or generate one based on alt text
  const bgColor = backgroundColor || generateColorFromString(alt);

  // Create default fallback if none provided
  const defaultFallback = fallback ? (
    fallback
  ) : (
    <div
      className={`flex items-center justify-center w-full h-full ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <span className="text-white font-medium text-lg">
        {alt?.charAt(0)?.toUpperCase() || "U"}
      </span>
    </div>
  );

  // Show fallback if source is missing or there was an error loading the image
  if (!src || src === "" || (imageError && showFallbackOnError)) {
    return defaultFallback;
  }

  // Handle relative URLs by prepending the API base URL
  let imgSrc = src;
  if (
    src &&
    !src.startsWith("http") &&
    !src.startsWith("data:") &&
    !src.startsWith("/")
  ) {
    imgSrc = `${process.env.NEXT_PUBLIC_URL}${
      src.startsWith("/") ? "" : "/"
    }${src}`;
  }

  if (!cloudinaryName) {
    return (
      <Image
        src={imgSrc}
        width={width}
        height={height || width}
        alt={alt || "Image"}
        className={className}
        onError={() => setImageError(true)}
      />
    );
  }

  // Check if the src is a valid URL before passing to CldImage
  try {
    // Simple validation to check if src could be a valid URL or path
    if (
      imgSrc.startsWith("http") ||
      imgSrc.startsWith("/") ||
      imgSrc.startsWith("data:")
    ) {
      return (
        <CldImage
          src={imgSrc}
          width={width}
          height={height || width}
          alt={alt || "Image"}
          className={className}
          onError={() => setImageError(true)}
          crop="fill"
          gravity="center"
        />
      );
    } else {
      // If src doesn't look like a valid URL, show fallback
      return defaultFallback;
    }
  } catch (error) {
    console.error("Error rendering image:", error);
    return defaultFallback;
  }
}
