import OptimizeImage from "@/components/custom/optimizeImage";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BlogPost } from "@/types/blog";
import DOMPurify from "dompurify";

interface BlogCardProps {
  post: BlogPost;
  size: "small" | "wide" | "tall" | "large";
}

const truncateContent = (content: string, maxLength: number) => {
  if (content.length <= maxLength) return content;
  const truncated = content.substring(0, maxLength);
  return truncated.substring(0, truncated.lastIndexOf(" ")) + "...";
};

export default function BlogCard({ post, size }: BlogCardProps) {
  // Define grid span classes based on size
  const sizeClasses = {
    small: "",
    wide: "md:col-span-2",
    tall: "md:row-span-2",
    large: "md:col-span-2 md:row-span-2",
  };

  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg h-full w-full",
        sizeClasses[size]
      )}
    >
      <Link href={`/blogs/${post.slug}`} className="absolute inset-0 z-20">
        <span className="sr-only">View {post.title}</span>
      </Link>

      {/* Background Image or Color */}
      {post.thumbnail ? (
        <div className="absolute inset-0 z-0">
          <OptimizeImage
            src={post.thumbnail}
            alt={post.title || "Blog thumbnail"}
            width={900}
            height={900}
            showFallbackOnError={true}
            fallback={
              <div
                className={cn("w-full h-full", post.bgColor || "bg-primary")}
              ></div>
            }
            className="object-cover w-full h-full"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30 z-10"></div>
        </div>
      ) : (
        <div
          className={cn("absolute inset-0 z-0", post.bgColor || "bg-primary")}
        ></div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full w-full flex flex-col p-6 text-white">
        {/* Category Tag */}
        {post.category && (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-black/40 rounded-full mb-2">
            {post.category}
          </span>
        )}

        <div className="flex flex-col h-full justify-end">
          <h3 className="text-xl md:text-2xl font-bold mb-2">{post.title}</h3>
          <p
            className="text-sm text-white/80 mb-4"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(truncateContent(post.content, 100)),
            }}
          ></p>
        </div>
      </div>
    </div>
  );
}
