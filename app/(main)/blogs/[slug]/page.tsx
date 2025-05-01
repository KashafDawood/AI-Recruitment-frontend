"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBlogBySlug } from "@/api/blogs/blogApi";
import { Blog } from "@/types/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Clock,
  User,
  Tag,
  Share2,
  Heart,
  Bookmark,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import OptimizeImage from "@/components/custom/optimizeImage";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
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

  useEffect(() => {
    const handleScroll = () => {
      if (!document.getElementById("blog-content")) return;

      const contentElement = document.getElementById("blog-content")!;
      const totalHeight =
        contentElement.scrollHeight - contentElement.clientHeight;
      const windowScrollTop = window.scrollY - contentElement.offsetTop;

      if (windowScrollTop >= 0) {
        const scrolled = Math.min(
          100,
          Math.floor((windowScrollTop / totalHeight) * 100)
        );
        setReadingProgress(scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [blog]);

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

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const handleLike = () => setLiked(!liked);
  const handleBookmark = () => setBookmarked(!bookmarked);
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: blog?.title || "Blog post",
          text: `Check out this blog post: ${blog?.title}`,
          url: window.location.href,
        })
        .catch((err) => console.log("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <Card className="border-none shadow-lg bg-white/70 backdrop-blur-md dark:bg-gray-900/70">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center h-24">
              <div className="animate-pulse flex flex-col items-center gap-4 w-full">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="mt-8 h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-4xl">
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

  const readingTime = estimateReadingTime(blog.content);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-12 px-4 sm:px-6 max-w-5xl"
      >
        <Button
          variant="ghost"
          onClick={() => router.push("/blogs")}
          className="mb-8 group"
        >
          <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="transition-all group-hover:underline">
            Back to Blogs
          </span>
        </Button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="relative mb-8 overflow-hidden rounded-2xl shadow-xl"
        >
          {blog.thumbnail ? (
            <div className="relative w-full h-[400px] md:h-[500px]">
              <OptimizeImage
                width={1200}
                height={500}
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                {blog.category && (
                  <Badge className="bg-green-600 hover:bg-green-700 transition-colors mb-4 px-3 py-1 text-sm">
                    {blog.category}
                  </Badge>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 drop-shadow-sm">
                  {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    <span>{formatDate(blog.created_at)}</span>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1.5" />
                    <span>{readingTime} min read</span>
                  </div>

                  {blog.employer && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1.5" />
                      <span>
                        By{" "}
                        <Link
                          href={`/${blog.employer.username}`}
                          className="hover:underline font-medium"
                        >
                          {blog.employer.name}
                        </Link>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-600 to-green-400 p-8 md:p-10 text-white rounded-2xl">
              {blog.category && (
                <Badge className="bg-white/20 hover:bg-white/30 text-white mb-4 px-3 py-1 text-sm">
                  {blog.category}
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-100">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  <span>{formatDate(blog.created_at)}</span>
                </div>

                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1.5" />
                  <span>{readingTime} min read</span>
                </div>

                {blog.employer && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1.5" />
                    <span>
                      By{" "}
                      <Link
                        href={`/${blog.employer.username}`}
                        className="hover:underline font-medium"
                      >
                        {blog.employer.name}
                      </Link>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 relative">
          <div className="hidden lg:flex sticky self-start top-24 flex-col gap-4 items-center">
            <Button
              onClick={handleLike}
              variant="outline"
              size="icon"
              className={`rounded-full h-12 w-12 ${
                liked
                  ? "bg-red-100 dark:bg-red-900/30 text-red-500 border-red-300 dark:border-red-600"
                  : ""
              }`}
              aria-label="Like"
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
            </Button>
            <Button
              onClick={handleBookmark}
              variant="outline"
              size="icon"
              className={`rounded-full h-12 w-12 ${
                bookmarked
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-500 border-blue-300 dark:border-blue-600"
                  : ""
              }`}
              aria-label="Bookmark"
            >
              <Bookmark
                className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`}
              />
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12"
              aria-label="Share"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <Card className="lg:flex-1 border-none shadow-xl overflow-hidden bg-white dark:bg-gray-900">
            <CardContent id="blog-content" className="p-6 md:p-10">
              <div
                className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-green-800 dark:prose-headings:text-green-400 prose-a:text-green-600 dark:prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {blog.keywords && (
                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 m-0 p-0">
                      Keywords
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blog.keywords.split(",").map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {keyword.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {blog.employer && (
                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                    About the author
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 relative rounded-full overflow-hidden">
                      <OptimizeImage
                        src={blog.employer.photo || ""}
                        alt={blog.employer.name}
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/${blog.employer.username}`}
                        className="text-xl font-semibold hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      >
                        {blog.employer.name}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {blog.employer.bio || blog.employer.company_name || ""}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:hidden flex justify-center gap-4 mt-8">
          <Button
            onClick={handleLike}
            variant="outline"
            size="icon"
            className={`rounded-full h-12 w-12 ${
              liked
                ? "bg-red-100 dark:bg-red-900/30 text-red-500 border-red-300 dark:border-red-600"
                : ""
            }`}
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
          </Button>
          <Button
            onClick={handleBookmark}
            variant="outline"
            size="icon"
            className={`rounded-full h-12 w-12 ${
              bookmarked
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-500 border-blue-300 dark:border-blue-600"
                : ""
            }`}
          >
            <Bookmark
              className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`}
            />
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </>
  );
}
