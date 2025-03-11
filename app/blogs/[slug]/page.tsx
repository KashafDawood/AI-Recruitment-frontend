"use client";

import React from "react";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBlog } from "@/api/blogs/getBlog";

interface Blog {
  title: string;
  content: string;
}

export default function BlogPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    if (slug) {
      getBlog(slug).then((data) => setBlog(data));
    }
  }, [slug]);

  if (!slug) {
    return <div>This blog does not exist</div>;
  }

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-900 text-white p-10 rounded-xl shadow-lg max-w-7xl mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
      <div
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
      ></div>
    </div>
  );
}
