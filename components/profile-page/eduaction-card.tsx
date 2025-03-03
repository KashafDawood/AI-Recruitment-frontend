"use client";
import { Calendar, GraduationCapIcon as Graduation } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { GlowCard, vibrantColors } from "../custom/GlowCard";

// Redefining the type to match exactly what's expected
export type Education = {
  degree_name: string;
  institute_name: string;
  start_date: string;
  end_date?: string | null | undefined;
  is_studying: boolean;
};

export type EducationData = {
  [key: string]: Education;
};

// Format date from YYYY-MM-DD to Month YYYY
const formatDate = (dateString?: string | null) => {
  if (!dateString) return "Present";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Present";
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } catch {
    return "Present";
  }
};

export default function EducationTimeline({
  educationData,
}: {
  educationData?: EducationData | null | undefined;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!educationData) return null;

  // Convert the education data object to an array safely and sort by start date (newest first)
  const educationArray = Object.entries(educationData || {})
    .map(([, education]) => education)
    .filter((edu) => edu && typeof edu === "object")
    .sort((a, b) => {
      try {
        const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
        const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
        return dateB - dateA;
      } catch {
        return 0;
      }
    });

  if (educationArray.length === 0) return null;

  // Assign a color to each education item
  const educationWithColors = educationArray.map((edu, index) => ({
    ...edu,
    color: vibrantColors[index % vibrantColors.length],
  }));

  return (
    <div className="w-full overflow-x-hidden">
      <div className="pt-8">
        <h1 className="text-6xl font-bold font-aclonica text-center mb-6">
          My Education Journey
        </h1>
      </div>
      <div className="relative container max-w-5xl mx-auto py-8 px-4">
        {/* Center line for large screens, left line for small screens */}
        <div
          className="hidden md:block absolute md:left-1/2 left-0 md:transform md:-translate-x-1/2 h-full w-0.5 bg-gray-300 ml-5 md:ml-0"
          style={{ maxHeight: "calc(100% - 2rem)" }}
        ></div>

        {/* Education items */}
        {educationWithColors.map((education, index) => {
          const isAlternate =
            isMounted && index % 2 !== 0 && window.innerWidth >= 768;

          return (
            <div
              key={index}
              className={cn("relative flex items-center mb-12", "flex-row", {
                "md:flex-row-reverse": isAlternate,
              })}
            >
              {/* Date */}
              <div
                className={cn(
                  "hidden md:block md:w-1/2 text-sm text-gray-500 font-medium",
                  index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                )}
              >
                {formatDate(education.start_date)}
              </div>

              {/* Circle on timeline */}
              <div
                className="absolute md:left-1/2 left-0 transform md:-translate-x-1/2 w-10 h-10 rounded-full hidden md:flex items-center justify-center z-10 ml-0 md:ml-0"
                style={{ backgroundColor: education.color }}
              >
                <Graduation className="w-5 h-5 text-white" />
              </div>

              {/* Education card */}
              <GlowCard color={education.color} isAlternate={isAlternate}>
                <div className="dark:bg-gray-900 bg-gray-100 p-6 rounded-lg transition-all shadow-lg">
                  <h3 className="text-xl font-bold text-black dark:text-white">
                    {education.degree_name}
                  </h3>
                  <h4
                    className="text-lg font-black mt-1"
                    style={{ color: education.color }}
                  >
                    {education.institute_name}
                  </h4>

                  {/* Date for small screens */}
                  <div className="flex items-center mt-3 text-sm md:hidden text-gray-200 dark:text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {formatDate(education.start_date)} -{" "}
                      {formatDate(education.end_date)}
                    </span>
                  </div>

                  {/* Date for medium and large screens */}
                  <div className="hidden md:flex items-center mt-3 text-sm dark:text-gray-200 text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {formatDate(education.start_date)} -{" "}
                      {formatDate(education.end_date)}
                    </span>
                  </div>

                  {!education.end_date && (
                    <div
                      className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${education.color}20`,
                        color: education.color,
                      }}
                    >
                      Currently Studying
                    </div>
                  )}
                </div>
              </GlowCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
