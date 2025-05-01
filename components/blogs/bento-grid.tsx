"use client";

import { useState, useEffect } from "react";
import BlogCard from "./blog-card";
import { blogList } from "@/api/blogs/blogList";
import { useMobile } from "@/hooks/use-mobile-bento";
import { BlogPost } from "@/types/blog";
import PaginationUI from "@/components/custom/PaginationUI";
import { motion } from "framer-motion";
import { Search, Tag, Filter, BookOpen, Clock, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BentoGrid() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isMobile = useMobile();
  const postsPerPage = 12;

  // Calculate total pages
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Fetch posts and total count on initial load and when currentPage changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await blogList(currentPage, postsPerPage);
        if (data && data.results) {
          setPosts(data.results);
          setFilteredPosts(data.results);
          setTotalPosts(data.count);

          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(
              data.results
                .map((post) => post.category)
                .filter(Boolean) as string[]
            )
          );
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
        setError("Failed to load blog posts. Please try again later.");
        setPosts([]);
        setFilteredPosts([]);
        setTotalPosts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  // Filter posts based on search query and category
  useEffect(() => {
    let result = [...posts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          (post.content && post.content.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((post) => post.category === selectedCategory);
    }

    setFilteredPosts(result);

    // Update active filters
    const filters = [];
    if (searchQuery) filters.push(`Search: "${searchQuery}"`);
    if (selectedCategory) filters.push(`Category: ${selectedCategory}`);
    setActiveFilters(filters);
  }, [searchQuery, selectedCategory, posts]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Search is already applied via the useEffect
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setActiveFilters([]);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(12)
      .fill(0)
      .map((_, index) => {
        // Determine the size of the skeleton based on the position
        let className = "col-span-1 row-span-1 h-64";

        if (!isMobile) {
          if (index === 0 || index === 7) {
            className = "col-span-2 row-span-2 h-80";
          } else if (index === 2 || index === 5 || index === 10) {
            className = "col-span-2 row-span-1 h-64";
          } else if (index === 3 || index === 8) {
            className = "col-span-1 row-span-2 h-80";
          }
        }

        return (
          <div key={index} className={className}>
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        );
      });
  };

  return (
    <div className="space-y-6">
      {/* Search and filter section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800/30 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search blog posts..."
            className="pl-10 pr-4 py-2 h-11 w-full"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 gap-2">
                <Tag className="h-4 w-4" />
                <span>Categories</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={
                    selectedCategory === category
                      ? "bg-primary/10 font-medium"
                      : ""
                  }
                >
                  {category}
                </DropdownMenuItem>
              ))}
              {categories.length === 0 && (
                <DropdownMenuItem disabled>
                  No categories found
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="default"
            className="h-11 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white gap-2"
          >
            <BookOpen className="h-4 w-4" />
            <span>Latest Posts</span>
          </Button>
        </div>
      </motion.div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Active filters:
          </span>
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            >
              {filter}
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-3.5 w-3.5 mr-1" /> Clear all
          </Button>
        </motion.div>
      )}

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg text-center"
        >
          <p>{error}</p>
          <Button
            variant="outline"
            className="mt-2 text-xs border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </motion.div>
      )}

      {/* Blog posts grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr min-h-[300px]">
          {renderSkeletons()}
        </div>
      ) : filteredPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center bg-white dark:bg-gray-800/30 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 mb-4">
            <Clock className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
            {searchQuery || selectedCategory
              ? "No posts matching your search criteria. Try adjusting your filters."
              : "There are no blog posts available at the moment. Please check back later."}
          </p>
          {(searchQuery || selectedCategory) && (
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr"
        >
          {filteredPosts.map((post, index) => {
            // Apply different card sizes based on position in the grid
            let size: "small" | "large" | "wide" | "tall" = "small";

            if (!isMobile) {
              if (index === 0 || index === 7) {
                size = "large"; // 2x2
              } else if (index === 2 || index === 5 || index === 10) {
                size = "wide"; // 2x1
              } else if (index === 3 || index === 8) {
                size = "tall"; // 1x2
              }
            }

            return (
              <motion.div key={post.id} variants={cardVariants}>
                <BlogCard post={post} size={size} />
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 0 && filteredPosts.length > 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-10"
        >
          <PaginationUI
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </motion.div>
      )}
    </div>
  );
}
