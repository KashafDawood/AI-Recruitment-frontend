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

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-3 text-white tracking-tight">
          Latest Blogs
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Stay updated with our latest insights and industry trends
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-800/30 animate-pulse rounded-xl h-96"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => {
              const sanitizedContent = DOMPurify.sanitize(
                blog.content.substring(0, 120) + "..."
              );
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-700/30 hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    {blog.thumbnail ? (
                      <OptimizeImage
                        src={blog.thumbnail}
                        alt={blog.title}
                        width={900}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    )}
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center text-xs text-gray-400 mb-3">
                      <span className="mr-2">
                        {new Date(
                          blog.created_at || Date.now()
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {blog.category && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded-full">
                            {blog.category}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                      {blog.title}
                    </h3>

                    <div
                      className="text-gray-300 text-sm mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    ></div>

                    <div className="mt-auto">
                      <button
                        onClick={() => handleReadMore(blog.slug)}
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium"
                      >
                        Read Article
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
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
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {blogs.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => router.push("/blogs")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              View All Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
