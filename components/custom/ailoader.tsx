"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export function AILoadingAnimation() {
  return (
    <div className="w-full space-y-4">
      <div className="relative flex justify-center items-center h-24">
        {/* Main sparkle icon */}
        <div className="relative animate-pulse-slow">
          <Sparkles className="h-12 w-12 text-primary" strokeWidth={1.5} />

          {/* Glow effect */}
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10"></div>
        </div>

        {/* Surrounding sparkles */}
        <SparkleEffect />
      </div>

      {/* Thinking text */}
      <ThinkingText />
    </div>
  );
}

function SparkleEffect() {
  const [sparkles, setSparkles] = useState<
    Array<{
      id: number;
      size: number;
      left: number;
      top: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    // Create initial sparkles
    const initialSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 3,
      left: Math.random() * 160 - 30, // -30% to 130%
      top: Math.random() * 160 - 30, // -30% to 130%
      delay: Math.random() * 2000,
    }));

    setSparkles(initialSparkles);

    // Add new sparkles periodically
    const interval = setInterval(() => {
      setSparkles((prev) => [
        ...prev,
        {
          id: Date.now(),
          size: Math.random() * 6 + 3,
          left: Math.random() * 160 - 30,
          top: Math.random() * 160 - 30,
          delay: 0,
        },
      ]);
    }, 600);

    // Clean up old sparkles to prevent memory issues
    const cleanup = setInterval(() => {
      setSparkles((prev) => {
        if (prev.length > 15) {
          return prev.slice(prev.length - 15);
        }
        return prev;
      });
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanup);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-sparkle"
          style={{
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animationDelay: `${sparkle.delay}ms`,
          }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 0L12.9389 9.0611L22 10L12.9389 10.9389L12 20L11.0611 10.9389L2 10L11.0611 9.0611L12 0Z"
              className="fill-primary"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}

function ThinkingText() {
  const [textIndex, setTextIndex] = useState(0);
  const thinkingTexts = [
    "Generating ideas...",
    "Processing request...",
    "Analyzing patterns...",
    "Creating content...",
    "Refining results...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % thinkingTexts.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [thinkingTexts.length]);

  return (
    <div className="text-center h-6">
      <p className="text-sm text-primary animate-fade-in">
        {thinkingTexts[textIndex]}
      </p>
    </div>
  );
}
