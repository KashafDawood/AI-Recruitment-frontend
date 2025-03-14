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

  // Calculate total pages
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Fetch posts and total count on initial load and when currentPage changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Handle the response from blogList properly
        const response = await blogList(currentPage, postsPerPage);

        // Check if response has expected structure
        if (response && Array.isArray(response)) {
          // If blogList returns just an array of posts
          setShuffledPosts(response);

          // If we got exactly postsPerPage items, there are likely more posts
          // If we got fewer, we're probably on the last page
          if (response.length === postsPerPage) {
            // Estimate at least one more page worth of posts
            setTotalPosts(currentPage * postsPerPage + postsPerPage);
          } else {
            // We're likely on the last page
            setTotalPosts((currentPage - 1) * postsPerPage + response.length);
          }
        } else if (response && typeof response === "object") {
          // If blogList returns an object with posts and total
          const { posts = [], total = 0 } = response as {
            posts: BlogPost[];
            total: number;
          };
          setShuffledPosts(posts);
          setTotalPosts(total);
        } else {
          // Fallback for unexpected response format
          console.error("Unexpected response format from blogList:", response);
          setShuffledPosts([]);
          setTotalPosts(0);
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
  }, [currentPage, postsPerPage]); // Remove totalPages dependency to avoid circular updates

  const handlePageChange = (page: number) => {
    // Ensure page is within valid range
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          isActive={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Add ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i <= totalPages && i > 1) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if it's not the first page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div>
      {/* ...existing code for showing blog posts... */}
      {loading ? (
        <div>Loading...</div>
      ) : shuffledPosts.length === 0 ? (
        <div>No more blogs available</div>
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
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {renderPaginationItems()}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
