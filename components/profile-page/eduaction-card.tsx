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
    <>
      <div className="pt-12">
        <h1 className="text-3xl font-bold text-center mb-8">
          My Education Journey
        </h1>
      </div>
      <div className="relative container max-w-5xl mx-auto py-12 px-4">
        {/* Center line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300"></div>

        {/* Education items */}
        {educationArray.map((education, index) => (
          <div
            key={index}
            className={cn(
              "relative flex items-center mb-16",
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            )}
          >
            {/* Date */}
            <div
              className={cn(
                "w-1/2 text-sm text-gray-500 font-medium",
                index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
              )}
            >
              {formatDate(education.start_date)}
            </div>

            {/* Circle on timeline */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full dark:bg-green-400 bg-green-600 flex items-center justify-center z-10">
              <Graduation className="w-5 h-5 text-white" />
            </div>

            {/* Education card */}
            <div className={cn("w-1/2", index % 2 === 0 ? "pl-8" : "pr-8")}>
              <div className="bg-gray-800 dark:bg-gray-200 p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold dark:text-black text-white">
                  {education.degree_name}
                </h3>
                <h4 className="text-lg font-black text-green-400 dark:text-green-600 mt-1">
                  {education.institute_name}
                </h4>

                <div className="flex items-center mt-3 text-sm text-gray-200 dark:text-gray-600">
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
    </>
  );
}
