"use client";

import { useEffect, useState, useMemo } from "react";
import { ChevronDown, Award, ExternalLink } from "lucide-react";
import { vibrantColors } from "../custom/GlowCard";
import Link from "next/link";

interface Certification {
  source?: string;
  source_url?: string;
  date_obtained?: string; // Format: yyyy-mm-dd
  certification_name?: string;
}

interface CertificationsProps {
  certifications?: (string | Certification)[] | null | undefined;
}

export default function Certifications({
  certifications = [],
}: CertificationsProps) {
  const [expanded, setExpanded] = useState(false);
  const [colors, setColors] = useState<string[]>([]);

  // Format date from yyyy-mm-dd to a more readable format
  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  // Sort certifications by date (newest first)
  const sortedCertifications = useMemo(() => {
    // Ensure we have a valid array to sort
    const certsToSort = Array.isArray(certifications) ? certifications : [];

    // Filter out string values
    const validCerts = certsToSort.filter(
      (cert): cert is Certification => typeof cert === "object" && cert !== null
    );

    return [...validCerts].sort((a, b) => {
      const dateA = a?.date_obtained ? new Date(a.date_obtained).getTime() : 0;
      const dateB = b?.date_obtained ? new Date(b.date_obtained).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });
  }, [certifications]);

  const displayedCertifications = expanded
    ? sortedCertifications
    : sortedCertifications.slice(0, 3);

  useEffect(() => {
    const generatedColors = sortedCertifications.map(() => {
      const randomIndex = Math.floor(Math.random() * vibrantColors.length);
      return vibrantColors[randomIndex];
    });
    setColors(generatedColors);
  }, [sortedCertifications]);

  if (!sortedCertifications || sortedCertifications.length === 0) {
    return null; // Or a placeholder message when no certifications are provided
  }

  return (
    <div className="py-16 px-4">
      <h2 className="text-foreground font-aclonica text-5xl font-bold mb-10 text-center">
        My Certifications
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {displayedCertifications.map((cert, index) => {
          const cardColor = colors[index];
          const CardWrapper = ({ children }: { children: React.ReactNode }) => {
            return cert.source_url ? (
              <Link
                href={cert.source_url}
                rel="noopener noreferrer"
                target="_blank"
                className="block h-full transition-transform hover:scale-[1.02] cursor-pointer"
              >
                {children}
              </Link>
            ) : (
              <div className="h-full">{children}</div>
            );
          };

          return (
            <div
              key={index}
              className="group relative transform perspective-800 transition-transform duration-400 hover:rotate-y-5"
            >
              <CardWrapper>
                <div
                  className="relative h-full z-10 overflow-hidden bg-card bg-opacity-20 backdrop-blur-sm border border-primary/30 p-6 rounded-lg shadow-md dark:bg-gray-900 bg-gray-100
                    hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                  style={{
                    borderColor: `${cardColor}30`,
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <Award style={{ color: cardColor }} className="h-8 w-8" />
                    <span style={{ color: cardColor }} className="text-sm">
                      {formatDate(cert.date_obtained)}
                    </span>
                  </div>
                  <h3 className="text-card-foreground text-xl font-semibold mb-2">
                    {cert.certification_name}
                  </h3>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <span>{cert.source}</span>
                    {cert.source_url && (
                      <ExternalLink className="h-3 w-3 ml-1 inline" />
                    )}
                  </div>

                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(45deg, ${cardColor}10, ${cardColor}20)`,
                    }}
                  ></div>

                  {/* Glow effect replacement */}
                  <div
                    className="absolute -inset-2 z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                    style={{
                      background: `linear-gradient(45deg, ${cardColor}20, transparent)`,
                    }}
                  ></div>
                </div>
              </CardWrapper>
            </div>
          );
        })}
      </div>

      {sortedCertifications.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 mx-auto mt-8 text-primary hover:text-primary/80 transition-colors"
        >
          <span>{expanded ? "Show Less" : "Show More"}</span>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      )}
    </div>
  );
}
