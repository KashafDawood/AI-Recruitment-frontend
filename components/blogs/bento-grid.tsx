"use client";

import { useState, useEffect } from "react";
import BlogCard from "./blog-card";
import { blogPosts } from "./blog-post";
import { useMobile } from "@/hooks/use-mobile-bento";

export default function BentoGrid() {
  const [shuffledPosts, setShuffledPosts] = useState(blogPosts);
  const isMobile = useMobile();

  // Shuffle posts on initial load
  useEffect(() => {
    const shuffled = [...blogPosts].sort(() => Math.random() - 0.5);
    setShuffledPosts(shuffled);
  }, []);

  return (
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
  );
}
