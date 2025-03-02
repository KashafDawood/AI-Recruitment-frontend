"use client";
import DOMPurify from "dompurify";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ProfileBio({ bio }: { bio: string }) {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Sanitize content
  const sanitizedBio = DOMPurify.sanitize(bio);

  // Check if content is overflowing and needs read more button
  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        // On small screens (< 768px), show button if content height > 150px
        // On larger screens, always show full content
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          setShowButton(contentRef.current.scrollHeight > 150);
        } else {
          setShowButton(false);
          setExpanded(true);
        }
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [bio]);

  return (
    <div className="relative py-10 px-6 md:px-10">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-secondary/20 to-transparent rounded-full translate-x-1/3 translate-y-1/3" />

      {/* Content */}
      <div className="relative z-10 backdrop-blur-sm bg-background/60 rounded-xl p-6 border border-muted shadow-lg">
        {/* Simple heading that will definitely be visible */}
        <div className="relative mb-8">
          <h1 className="text-6xl font-bold font-aclonica text-start">
            My Story
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-4" />
        </div>

        <div className="relative">
          <div
            ref={contentRef}
            className={`prose max-w-none text-start relative overflow-hidden transition-all duration-300 ${
              !expanded && showButton ? "max-h-[150px] md:max-h-none" : ""
            }`}
            dangerouslySetInnerHTML={{ __html: sanitizedBio }}
          />

          {/* Gradient fade effect when collapsed */}
          {showButton && !expanded && (
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
          )}

          {/* Read more/less button */}
          {showButton && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 flex items-center justify-center w-full py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {expanded ? (
                <>
                  Show Less <ChevronUp className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  Read More <ChevronDown className="ml-1 h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
