import OptimizeImage from "@/components/custom/optimizeImage";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BlogPost } from "@/types/blog";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
  size: "small" | "wide" | "tall" | "large";
}

const truncateContent = (content: string, maxLength: number) => {
  if (!content) return "";
  if (content.length <= maxLength) return content;
  const truncated = content.substring(0, maxLength);
  return truncated.substring(0, truncated.lastIndexOf(" ")) + "...";
};

const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (e) {
    console.error("Date formatting error:", e);
    return "";
  }
};

export default function BlogCard({ post, size }: BlogCardProps) {
  // Define grid span classes based on size
  const sizeClasses = {
    small: "",
    wide: "md:col-span-2",
    tall: "md:row-span-2",
    large: "md:col-span-2 md:row-span-2",
  };

  // Define content classes based on size
  const contentClasses = {
    small: "p-5",
    wide: "p-6",
    tall: "p-6",
    large: "p-8",
  };

  // Define title classes based on size
  const titleClasses = {
    small: "text-lg",
    wide: "text-xl",
    tall: "text-xl",
    large: "text-2xl md:text-3xl",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "relative group overflow-hidden rounded-xl transition-all duration-300 h-full w-full shadow-md hover:shadow-xl",
        sizeClasses[size]
      )}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <Link href={`/blogs/${post.slug}`} className="absolute inset-0 z-20">
        <span className="sr-only">View {post.title}</span>
      </Link>

      {/* Background Image or Color */}
      {post.thumbnail ? (
        <div className="absolute inset-0 z-0">
          <motion.div
            className="h-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <OptimizeImage
              src={post.thumbnail}
              alt={post.title || "Blog thumbnail"}
              width={900}
              height={900}
              showFallbackOnError={true}
              fallback={
                <div
                  className={cn(
                    "w-full h-full",
                    post.bgColor ||
                      "bg-gradient-to-br from-green-600 to-green-400"
                  )}
                ></div>
              }
              className="object-cover w-full h-full transition-transform duration-700"
            />
          </motion.div>
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10 z-10"></div>
        </div>
      ) : (
        <div
          className={cn(
            "absolute inset-0 z-0",
            post.bgColor || "bg-gradient-to-br from-green-600 to-green-400"
          )}
        ></div>
      )}

      {/* Content */}
      <div
        className={cn(
          "relative z-10 h-full w-full flex flex-col justify-between text-white",
          contentClasses[size]
        )}
      >
        <div className="flex justify-between items-start">
          {/* Category Tag */}
          {post.category && (
            <span className="inline-block px-3 py-1 text-xs font-medium bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              {post.category}
            </span>
          )}

          {/* Date */}
          {post.created_at && (
            <div className="flex items-center text-xs text-white/80">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(post.created_at)}</span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <h3
            className={cn(
              "font-bold mb-2 group-hover:text-green-300 transition-colors duration-300",
              titleClasses[size]
            )}
          >
            {post.title}
          </h3>

          {(size === "wide" || size === "large" || size === "tall") && (
            <div
              className="text-sm text-white/80 mb-4 line-clamp-3"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  truncateContent(post.content, size === "large" ? 150 : 100)
                ),
              }}
            ></div>
          )}

          <div className="flex items-center text-xs text-white/70 mt-2 group-hover:text-white/90 transition-colors duration-300">
            <span className="mr-2 group-hover:underline">Read article</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-right group-hover:translate-x-1 transition-transform duration-300"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
