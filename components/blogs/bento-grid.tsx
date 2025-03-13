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
} from "@/components/ui/pagination"
import { Divide } from "lucide-react";

export default function BentoGrid() {
  const [shuffledPosts, setShuffledPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const isMobile = useMobile();
  const postsPerPage = 10;

  // Fetch posts on initial load and when currentPage changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const posts = await blogList(currentPage, postsPerPage);
      setShuffledPosts(posts);
      setLoading(false);
    };

    fetchPosts();
  }, [currentPage]);

  // Effect to run when shuffledPosts changes
  useEffect(() => {
    // This effect ensures the component re-renders when shuffledPosts changes
  }, [shuffledPosts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : shuffledPosts.length === 0 ? (
        <div>No more blogs available</div>
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
            <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={currentPage === 1} onClick={() => handlePageChange(1)}>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={currentPage === 2} onClick={() => handlePageChange(2)}>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={currentPage === 3} onClick={() => handlePageChange(3)}>3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
