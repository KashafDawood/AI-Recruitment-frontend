"use client";

import { motion } from "framer-motion";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-6 h-10">
        {/* Static circle */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 19.6 26.18"
          className="absolute top-0 left-0 w-full h-full"
        >
          <circle fill="#27b475" cx="6.29" cy="6.29" r="6.29" />
        </svg>

        {/* Rotating arc */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 19.6 26.18"
          className="absolute top-0 left-0 w-full h-full"
          animate={{
            rotate: 360,
          }}
          style={{
            transformOrigin: "6.29px 6.29px", // Set transform origin to match circle's center
          }}
          transition={{
            duration: 1.5,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          <path
            fill="#27b475"
            d="M19.3,1.92c2.12,11.71-7.45,23-19.14,24.26V15.71a14.85,14.85,0,0,0,11.55-2.23A17.44,17.44,0,0,0,19.06,1.92Z"
          />
        </motion.svg>
      </div>
    </div>
  );
}
