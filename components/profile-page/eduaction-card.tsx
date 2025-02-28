"use client";
import { Calendar, GraduationCapIcon as Graduation } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <div className="w-full overflow-x-hidden">
      <div className="pt-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          My Education Journey
        </h1>
      </div>
      <div className="relative container max-w-5xl mx-auto py-8 px-4">
        {/* Center line for large screens, left line for small screens */}
        <div
          className="absolute md:left-1/2 left-0 md:transform md:-translate-x-1/2 h-full w-0.5 bg-gray-300 ml-5 md:ml-0"
          style={{ maxHeight: "calc(100% - 2rem)" }}
        ></div>

        {/* Education items */}
        {educationArray.map((education, index) => (
          <div
            key={index}
            className={cn(
              "relative flex items-center mb-12",
              // For small screens, always keep items on the right
              // For medium and larger screens, alternate sides
              "flex-row",
              {
                "md:flex-row-reverse":
                  index % 2 !== 0 && window.innerWidth >= 768,
              }
            )}
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
            <div className="absolute md:left-1/2 left-0 transform md:-translate-x-1/2 w-10 h-10 rounded-full dark:bg-green-400 bg-green-600 flex items-center justify-center z-10 ml-0 md:ml-0">
              <Graduation className="w-5 h-5 text-white" />
            </div>

            {/* Education card */}
            <div
              className={cn(
                "md:w-1/2 w-full pl-16 md:pl-8",
                index % 2 === 0 ? "md:pl-8" : "md:pr-8 md:pl-0"
              )}
            >
              <div className="bg-gray-800 dark:bg-gray-200 p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold dark:text-black text-white">
                  {education.degree_name}
                </h3>
                <h4 className="text-lg font-black text-green-400 dark:text-green-600 mt-1">
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
                <div className="hidden md:flex items-center mt-3 text-sm text-gray-200 dark:text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {formatDate(education.start_date)} -{" "}
                    {formatDate(education.end_date)}
                  </span>
                </div>

                {!education.end_date && (
                  <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Currently Studying
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
