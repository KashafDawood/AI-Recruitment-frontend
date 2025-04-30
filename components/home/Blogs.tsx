"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { getAllBlogs } from "@/api/blogs/blogApi";
import OptimizeImage from "../custom/optimizeImage";
import { motion } from "framer-motion";
import { Blog } from "@/types/blog";

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    getAllBlogs()
      .then((response) => {
        // Check if response is valid
        if (!response) {
          setError("No data received from server");
          return;
        }

        // Extract blog data - handle both array and object with results property
        const blogsData = Array.isArray(response)
          ? response
          : response.results
          ? response.results
          : [];

        // Sort blogs by created_at date (newest first) and take only the 3 most recent
        const sortedBlogs = [...blogsData]
          .sort((a, b) => {
            // Safely handle date conversion
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 3);

        setBlogs(sortedBlogs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blog posts");
        setLoading(false);
      });
  }, []);

  const handleReadMore = (slug: string) => {
    router.push(`/blogs/${slug}`);
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return ""; // Handle undefined dates

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return ""; // Return empty string on invalid dates
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  return (
    <div className="py-16 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <h2 className="text-4xl font-bold text-center mb-3 dark:text-white text-black tracking-tight">
            Latest Blogs
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Stay updated with our latest insights and industry trends
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg h-96"
              ></div>
            ))}
          </div>
        ) : error ? (
          <motion.div
            className="text-center py-16"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="mx-auto max-w-md">
              <h3 className="text-xl font-medium text-red-500 dark:text-red-400 mb-4">
                {error}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Please try again later.
              </p>
            </div>
          </motion.div>
        ) : blogs.length === 0 ? (
          <motion.div
            className="text-center py-16"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="mx-auto max-w-md">
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
                No blogs published yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Check back later for new articles and insights from our experts.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {blogs.map((blog, index) => {
              const sanitizedContent = DOMPurify.sanitize(
                blog.content.substring(0, 100) + "..."
              );
              return (
                <motion.div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => handleReadMore(blog.slug)}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="overflow-hidden rounded-lg mb-4">
                    {blog.thumbnail ? (
                      <div className="relative h-64 w-full overflow-hidden">
                        <OptimizeImage
                          src={blog.thumbnail}
                          alt={blog.title}
                          width={800}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-r from-green-400 to-green-600 rounded-lg"></div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                    {formatDate(blog.created_at)}{" "}
                    {blog.category && <span>• {blog.category}</span>}
                  </div>

                  <h3 className="text-xl font-bold dark:text-white text-gray-800 mb-3 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-green-700 group-hover:bg-clip-text group-hover:text-transparent transition-colors">
                    {blog.title}
                  </h3>

                  <div
                    className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                  ></div>

                  <div className="flex items-center mt-2">
                    <span className="text-sm bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent font-medium group-hover:underline">
                      Read more
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1 text-green-600 dark:text-green-400 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {blogs.length > 0 && (
          <motion.div
            className="mt-14 text-center"
            variants={buttonVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
          >
            <button
              onClick={() => router.push("/blogs")}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 dark:from-green-400 dark:to-green-600 dark:hover:from-green-500 dark:hover:to-green-700 font-light rounded-full transition-all duration-300"
            >
              View All Articles
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
