"use client";
import {
  Calendar,
  GraduationCapIcon as Graduation,
  Pencil,
  Plus,
  X,
  Trash2,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { GlowCard, vibrantColors } from "../custom/GlowCard";
import { Button } from "../ui/button";
import AddEducationForm from "./edit-education/addEducation-form";
import { useUserStore } from "@/store/userStore";
import { deleteEducation } from "@/api/user/deleteEducation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import EditEducationForm from "./edit-education/editEducation-form";

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
export const formatDate = (dateString?: string | null) => {
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
  onEditClick,
}: {
  educationData?: EducationData | null | undefined;
  onEditClick?: () => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [educationToDelete, setEducationToDelete] = useState<string | null>(
    null
  );
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

  if (educationArray.length === 0) return null;

  // Assign a color to each education item
  const educationWithColors = educationArray.map((edu, index) => ({
    ...edu,
    color: vibrantColors[index % vibrantColors.length],
  }));

  const handleEditClick = () => {
    setIsEditing(true);
    if (onEditClick) onEditClick();
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setIsAddingEducation(false);
  };

  const handleAddClick = () => {
    setIsAddingEducation(true);
  };

  const handleAddCancel = () => {
    setIsAddingEducation(false);
  };

  const handleAddSuccess = () => {
    setIsAddingEducation(false);
    refreshUser();
  };

  const handleEditEducation = (education: Education) => {
    setEditingEducation(education);
  };

  const handleCancelEditEducation = () => {
    setEditingEducation(null);
  };

  const handleDeleteEducation = (degreeName: string) => {
    setEducationToDelete(degreeName);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!educationToDelete) return;

    try {
      await deleteEducation(educationToDelete);
      await refreshUser();
      toast.success("Education deleted successfully");
    } catch (error) {
      toast.error("Failed to delete education");
      console.error(error);
    } finally {
      setDeleteConfirmOpen(false);
      setEducationToDelete(null);
    }
  };

  return (
    <div className="relative w-full">
      <div className="pt-8 flex justify-between">
        <h1 className="text-4xl md:text-6xl font-bold font-aclonica text-start mb-6">
          My Education Journey
        </h1>
        {isEditing ? (
          <Button
            onClick={handleEditCancel}
            variant="outline"
            size="icon"
            className="absolute top-4 right-0 z-20 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700"
            title="Cancel"
          >
            <X size={18} />
          </Button>
        ) : (
          <Button
            onClick={handleEditClick}
            variant="outline"
            size="icon"
            className="absolute top-4 right-0 z-20 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700"
            title="Edit Education"
          >
            <Pencil size={18} />
          </Button>
        )}
      </div>

      {isAddingEducation && (
        <AddEducationForm
          onCancel={handleAddCancel}
          onSuccess={handleAddSuccess}
        />
      )}

      {editingEducation && (
        <EditEducationForm
          education={editingEducation}
          onCancel={handleCancelEditEducation}
          onSuccess={() => {
            refreshUser();
            setEditingEducation(null);
          }}
        />
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this education entry from your
              profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="relative container max-w-5xl mx-auto py-8 px-4">
        {/* Add education button when in editing mode */}
        {isEditing && !isAddingEducation && (
          <div className="flex justify-center mb-6">
            <Button
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full z-10 shadow-md flex items-center gap-2"
              title="Add Education"
            >
              <Plus size={16} /> Add Education
            </Button>
          </div>
        )}

        {/* Center line for large screens */}
        <div
          className="hidden md:block absolute md:left-1/2 transform -translate-x-1/2 w-1 bg-gray-400 dark:bg-gray-600 z-0"
          style={{ height: "calc(100% - 35px)" }}
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
              <GlowCard
                className="md:w-1/2 w-full"
                color={education.color}
                isAlternate={isAlternate}
              >
                <div className="dark:bg-gray-900 bg-gray-100 p-6 rounded-lg transition-all shadow-lg relative">
                  {/* Edit/Delete buttons when in edit mode */}
                  {isEditing && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-500 hover:text-blue-500"
                        onClick={() => handleEditEducation(education)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                        onClick={() =>
                          handleDeleteEducation(education.degree_name)
                        }
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}

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
