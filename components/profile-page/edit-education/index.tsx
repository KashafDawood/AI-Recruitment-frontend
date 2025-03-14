"use client";
import {
  Calendar,
  GraduationCapIcon as Graduation,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { GlowCard, vibrantColors } from "../../custom/GlowCard";
import { Button } from "../../ui/button";
import { EducationData, formatDate } from "../education-card";
import AddEducationForm from "./addEducation-form";
import { useUserStore } from "@/store/userStore";

export default function AddEducation({
  educationData,
  onEditCancel,
}: {
  educationData?: EducationData | null | undefined;
  onEditCancel?: () => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { refreshUser } = useUserStore();

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

  if (educationArray.length === 0 && !isAddingNew) {
    return (
      <div className="relative w-full">
        <div className="pt-8 flex justify-between">
          <h1 className="text-6xl font-bold font-aclonica text-start mb-6">
            My Education Journey
          </h1>
          <Button
            onClick={onEditCancel}
            variant="outline"
            size="icon"
            className="absolute top-4 right-0 z-20 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700"
            title="Cancel"
          >
            <X size={18} />
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
            You haven&apos;t added any education details yet
          </p>
          <Button
            onClick={() => setIsAddingNew(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md flex items-center gap-2"
          >
            <Plus size={16} /> Add Education
          </Button>
        </div>
      </div>
    );
  }

  // Assign a color to each education item
  const educationWithColors = educationArray.map((edu, index) => ({
    ...edu,
    color: vibrantColors[index % vibrantColors.length],
  }));

  const handleAddClick = () => {
    setIsAddingNew(true);
  };

  const handleAddCancel = () => {
    setIsAddingNew(false);
  };

  const handleAddSuccess = () => {
    setIsAddingNew(false);
    refreshUser();
  };

  return (
    <div className="relative w-full overflow-x-hidden">
      <div className="pt-8 flex justify-between">
        <h1 className="text-6xl font-bold font-aclonica text-start mb-6">
          My Education Journey
        </h1>
        <Button
          onClick={onEditCancel}
          variant="outline"
          size="icon"
          className="absolute top-4 right-0 z-20 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700"
          title="Cancel Edit"
        >
          <X size={18} />
        </Button>
      </div>

      {isAddingNew ? (
        <AddEducationForm
          onCancel={handleAddCancel}
          onSuccess={handleAddSuccess}
        />
      ) : (
        <div className="flex justify-center my-6">
          <Button
            onClick={handleAddClick}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full z-10 shadow-md flex items-center gap-2"
            title="Add Education"
          >
            <Plus size={16} /> Add Education
          </Button>
        </div>
      )}

      <div className="relative container max-w-5xl mx-auto py-8 px-4">
        {/* Center line with fixed positioning */}
        <div
          className="hidden md:block absolute md:left-1/2 transform -translate-x-1/2 w-1 bg-gray-400 dark:bg-gray-600 z-0"
          style={{ top: "35px", height: "calc(100% - 35px)" }}
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
