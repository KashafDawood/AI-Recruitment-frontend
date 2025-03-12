"use client";
import DOMPurify from "dompurify";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";

type BioProps = {
  bio?: string;
  onEditClick?: () => void;
};

export default function ProfileBio({ bio, onEditClick }: BioProps) {
  const [expanded, setExpanded] = useState(false);
  const [bioHeight, setBioHeight] = useState(0);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const bioRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const processedBio = bio ? bio.replace(/<\/p>/g, "</p><br/>") : "";

  const sanitizedBio =
    typeof window !== "undefined"
      ? DOMPurify.sanitize(processedBio || "")
      : processedBio || "";

  useEffect(() => {
    // Initialize DOMPurify if needed
    if (typeof window !== "undefined" && !DOMPurify.isSupported) {
      console.warn("DOMPurify is not supported in this environment");
    }

    const updateHeight = () => {
      if (bioRef.current && contentRef.current) {
        const fullHeight = contentRef.current.scrollHeight;
        setBioHeight(fullHeight);

        // Only show expand button if content exceeds the collapsed height
        setNeedsExpansion(fullHeight > 200);
      }
    };

    updateHeight();

    // Update on window resize
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [bio]);

  return (
    <div className="relative py-10 px-6 md:px-10">
      <div className="flex justify-between">
        <h1 className="text-6xl font-bold font-aclonica text-start">
          My Story
        </h1>
        <Button
          onClick={onEditClick}
          variant="outline"
          size="icon"
          className="absolute top-4 right-0 z-20 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700"
          title="Edit Profile"
        >
          <Pencil size={18} />
        </Button>
      </div>
      <div
        ref={bioRef}
        className="relative prose prose-sm sm:prose-base max-w-none dark:prose-invert overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: expanded ? `${bioHeight}px` : "200px" }}
        aria-expanded={expanded}
      >
        <div
          ref={contentRef}
          className="pt-12"
          dangerouslySetInnerHTML={{ __html: sanitizedBio }}
        />

        {!expanded && needsExpansion && (
          <div
            className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-200 dark:from-slate-800 to-transparent pointer-events-none"
            aria-hidden="true"
          />
        )}
      </div>

      {needsExpansion && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="rounded-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300 group shadow-sm"
            aria-controls="bio-content"
            aria-label={expanded ? "Show less content" : "Read more content"}
          >
            <span className="font-medium mr-2 text-slate-800 dark:text-slate-200">
              {expanded ? "Show less" : "Read more"}
            </span>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-slate-600 dark:text-slate-300 transition-transform group-hover:-translate-y-1" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-300 transition-transform group-hover:translate-y-1" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
