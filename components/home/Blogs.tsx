"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { getLatestBlogs } from "@/api/blogs/getLatestBlogs";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getLatestBlogs().then(data => setBlogs(data));
  }, []);

  const handleReadMore = (slug: string) => {
    router.push(`/blogs/${slug}`);
  };

  return (
    <div className="bg-gray-900 text-white p-10 rounded-xl shadow-lg max-w-7xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">Latest Blogs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 lg:px-20">
        {blogs.map((blog, index) => {
          const sanitizedContent = DOMPurify.sanitize(blog.content.substring(0, 150));
          return (
            <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:bg-gray-700">
              <h3 className="text-xl font-semibold text-white mt-3">{blog.title}</h3>
              <p className="text-gray-300 mt-2" dangerouslySetInnerHTML={{ __html: sanitizedContent }}></p>
              <button onClick={() => handleReadMore(blog.slug)} className="text-yellow-400 mt-4">Read More</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
