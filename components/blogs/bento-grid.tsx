"use client";

import { useState, useEffect } from "react";
import BlogCard from "./blog-card";
import { blogList } from "@/api/blogs/blogList";
import { useMobile } from "@/hooks/use-mobile-bento";
import { BlogPost } from "@/types/blog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function BentoGrid() {
  const [shuffledPosts, setShuffledPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const isMobile = useMobile();
  const postsPerPage = 10;

  // Fetch posts on initial load and when currentPage changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { posts, total } = await blogList(currentPage, postsPerPage);
      setShuffledPosts(posts);
      setTotalPosts(total);
      setLoading(false);
    };

    fetchPosts();
  }, [currentPage]);

  // Calculate total number of pages
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
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
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={currentPage === index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}