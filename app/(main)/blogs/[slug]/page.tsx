"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getBlogBySlug } from "@/api/blogs/blogApi";
import { Blog } from "@/types/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import OptimizeImage from "@/components/custom/optimizeImage";
import { motion } from "framer-motion";

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { slug } = use(params);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogBySlug(slug);
        setBlog(data);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load the blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return "";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 max-w-4xl">
        <Card className="border-none shadow-lg bg-white/70 backdrop-blur-md dark:bg-gray-900/70">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center h-24">
              <div className="animate-pulse flex flex-col items-center gap-4 w-full">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto py-12 max-w-4xl">
        <Card className="border-none shadow-lg overflow-hidden bg-white/70 backdrop-blur-md dark:bg-gray-900/70">
          <CardContent className="p-8 text-center">
            <p className="text-red-500 mb-4 font-medium">
              {error || "Blog post not found"}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/blogs")}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 max-w-4xl"
    >
      <Button
        variant="ghost"
        onClick={() => router.push("/blogs")}
        className="mb-6 group"
      >
        <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span className="transition-all group-hover:underline">
          Back to Blogs
        </span>
      </Button>

      <Card className="border-none shadow-xl overflow-hidden bg-white/70 backdrop-blur-md dark:bg-gray-900/70">
        {blog.thumbnail && (
          <div className="w-full h-[400px] relative">
            <OptimizeImage
              width={1200}
              height={400}
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
          </div>
        )}

        <CardHeader className={blog.thumbnail ? "-mt-20 relative z-10" : ""}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {blog.category && (
                <Badge className="bg-green-600 hover:bg-green-700 transition-colors">
                  {blog.category}
                </Badge>
              )}
              <div className="flex items-center text-gray-400 dark:text-gray-300">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span className={blog.thumbnail ? "text-white" : ""}>
                  {formatDate(blog.created_at)}
                </span>
              </div>
            </div>
            <CardTitle
              className={`text-3xl md:text-4xl font-bold ${
                blog.thumbnail ? "text-white" : "text-gray-900 dark:text-white"
              }`}
            >
              {blog.title}
            </CardTitle>
            {blog.employer && (
              <div className="flex items-center gap-2">
                <User
                  className={`h-4 w-4 ${
                    blog.thumbnail
                      ? "text-gray-300"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                <span
                  className={`text-sm ${
                    blog.thumbnail
                      ? "text-gray-300"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  By <span className="font-medium">{blog.employer.name}</span>
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent
          className={`prose prose-lg max-w-none pb-12 dark:prose-invert ${
            blog.thumbnail ? "pt-4" : ""
          }`}
        >
          <div
            className="prose-headings:text-green-800 dark:prose-headings:text-green-400 prose-a:text-green-600 dark:prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {blog.keywords && (
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 m-0 p-0">
                  Keywords
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {blog.keywords.split(",").map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-gray-50 dark:bg-gray-800"
                  >
                    {keyword.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
