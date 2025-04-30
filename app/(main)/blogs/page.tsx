"use client";

import BentoGrid from "@/components/blogs/bento-grid";
import { motion } from "framer-motion";

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 pt-12 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4"
      >
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-400 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
            Blog & Resources
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Expert insights, industry trends, and helpful resources for
            employers and job seekers
          </p>
        </div>
        <BentoGrid />
      </motion.div>
    </main>
  );
}
