"use client";

import { useState, useEffect, JSX } from "react";
import BlogCard from "./blog-card";
import { blogList } from "@/api/blogs/blogList";
import { useMobile } from "@/hooks/use-mobile-bento";
import { BlogPost } from "@/types/blog";
import PaginationUI from "@/components/custom/PaginationUI";

export default function BentoGrid() {
  const [shuffledPosts, setShuffledPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const isMobile = useMobile();
  const postsPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Fetch posts and total count on initial load and when currentPage changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await blogList(currentPage, postsPerPage); // API call
        if (data && data.results) {
          setShuffledPosts(data.results);
          setTotalPosts(data.count); // Use the actual count from the API
        }
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
        setShuffledPosts([]);
        setTotalPosts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  return (
    <div>
      {/* ...existing code for showing blog posts... */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
          {/* ...existing code for blog cards... */}
          {shuffledPosts.map((post, index) => {
            // On mobile, all cards are small
            if (isMobile) {
              return <BlogCard key={post.id} post={post} size="small" />;
            }

            // On desktop, create a pattern of different sized cards
            let size: "small" | "large" | "wide" | "tall" = "small";

            // Make some cards larger based on their position
            if (index === 0 || index === 7) {
              size = "large"; // 2x2
            } else if (index === 2 || index === 5 || index === 10) {
              size = "wide"; // 2x1
            } else if (index === 3 || index === 8) {
              size = "tall"; // 1x2
            }

            return <BlogCard key={post.id} post={post} size={size} />;
          })}
        </div>
      )}

      {/* Only show pagination if there are posts */}
      {totalPages > 0 && (
        <PaginationUI
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
