"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { getLatestBlogs } from "@/api/blogs/getLatestBlogs";
import { BlogPost } from "@/types/blog";
import OptimizeImage from "../custom/optimizeImage";

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getLatestBlogs()
      .then((data) => setBlogs(data))
      .finally(() => setLoading(false));
  }, []);

  const handleReadMore = (slug: string) => {
    router.push(`/blogs/${slug}`);
  };

  const formatDate = (date: Date | undefined) => {
    return new Date(date || Date.now()).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="py-16 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-3 dark:text-white text-black tracking-tight">
          Latest Blogs
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Stay updated with our latest insights and industry trends
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg h-96"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog, index) => {
              const sanitizedContent = DOMPurify.sanitize(
                blog.content.substring(0, 100) + "..."
              );
              return (
                <div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => handleReadMore(blog.slug)}
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
                      className="h-4 w-4 ml-1 text-green-600 dark:text-green-400"
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
                </div>
              );
            })}
          </div>
        )}

        {blogs.length > 0 && (
          <div className="mt-14 text-center">
            <button
              onClick={() => router.push("/blogs")}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 dark:from-green-400 dark:to-green-600 dark:hover:from-green-500 dark:hover:to-green-700 font-light rounded-full transition-all duration-300"
            >
              View All Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
