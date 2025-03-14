"use client";
import {
  Calendar,
  GraduationCapIcon as Graduation,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { GlowCard, vibrantColors } from "../../custom/GlowCard";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { addEducation } from "@/api/user/addEducation";
import { toast } from "sonner";
import { DatePicker } from "@/components/custom/datePicker";

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

export default function EditEducationTimeline({
  educationData,
  onEditCencel,
}: {
  educationData?: EducationData | null | undefined;
  onEditCencel?: () => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  const [state, formAction] = useActionState(addEducation, undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Handle form submission success and errors
  useEffect(() => {
    if (state?.message) {
      toast.success(state.message);
      setIsClicked(false);
      // Here you would update the education data locally or refetch
    }
    if (state?.serverError) {
      toast.error(state.serverError);
    }
  }, [state]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle checkbox change
  const handleStudyingChange = (checked: boolean) => {
    setIsCurrentlyStudying(checked);
  };

  if (!educationData) return null;

  // Convert the education data object to an array safely and sort by start date (newest first)
  const educationArray = Object.entries(educationData || {})
    .map(([, education]) => education)
    .filter((edu) => edu && typeof edu === "object")
    .sort((a, b) => {
      // ...existing code...
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

  const handleCancel = () => {
    if (onEditCencel) {
      onEditCencel();
    }
  };

  const handleAddEducation = () => {
    setIsClicked(true);
  };

  // Handle form submission before it's sent to the server
  const handleSubmit = async (formData: FormData) => {
    // Convert dates to string format expected by the API
    if (startDate) {
      formData.set("start_date", startDate.toISOString().split("T")[0]);
    }

    if (endDate && !isCurrentlyStudying) {
      formData.set("end_date", endDate.toISOString().split("T")[0]);
    } else {
      formData.delete("end_date");
    }

    // Explicitly set is_studying field regardless of checkbox state
    formData.set("is_studying", isCurrentlyStudying ? "true" : "false");

    // Call the original form action
    formAction(formData);
  };

  return (
    <div className="relative w-full overflow-x-hidden">
      <div className="pt-8 flex justify-between">
        <h1 className="text-6xl font-bold font-aclonica text-start mb-6">
          My Education Journey
        </h1>
        <Button
          onClick={handleCancel}
          variant="outline"
          size="icon"
          className="absolute top-4 right-0 z-20 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700"
          title="Edit Profile"
        >
          <X size={18} />
        </Button>
      </div>

      {isClicked && (
        <div className="flex justify-center items-center my-8">
          <Card className="w-full max-w-lg shadow-lg border-t-4 border-t-blue-500">
            <CardHeader>
              <CardTitle className="text-2xl">Add Education</CardTitle>
              <CardDescription>
                Add your academic qualifications to your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="degree_name">Degree Name</Label>
                  <Input
                    id="degree_name"
                    name="degree_name"
                    placeholder="i.e. Bachelor of Computer Science"
                  />
                  {state?.errors?.degree_name && (
                    <p className="text-red-500 text-sm">
                      {state.errors.degree_name}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="institute_name">Institute Name</Label>
                  <Input
                    id="institute_name"
                    name="institute_name"
                    placeholder="i.e. Howard University"
                  />
                  {state?.errors?.institute_name && (
                    <p className="text-red-500 text-sm">
                      {state.errors.institute_name}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <DatePicker
                    date={startDate}
                    onDateChange={(date) => setStartDate(date)}
                    className="w-full"
                  />
                  {state?.errors?.start_date && (
                    <p className="text-red-500 text-sm">
                      {state.errors.start_date}
                    </p>
                  )}
                </div>

                <div className="flex flex-row items-start space-x-3 space-y-0 py-2">
                  <Checkbox
                    id="is_studying"
                    name="is_studying"
                    checked={isCurrentlyStudying}
                    onCheckedChange={handleStudyingChange}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="is_studying">Currently Studying</Label>
                    <p className="text-sm text-muted-foreground">
                      Check this if you&apos;re still studying here
                    </p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <DatePicker
                    date={endDate}
                    onDateChange={(date) => setEndDate(date)}
                    className="w-full"
                    disabled={isCurrentlyStudying}
                  />
                  {isCurrentlyStudying && (
                    <p className="text-muted-foreground text-sm">
                      End date is set to &quot;Present&quot; while currently
                      studying
                    </p>
                  )}
                  {state?.errors?.end_date && (
                    <p className="text-red-500 text-sm">
                      {state.errors.end_date}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsClicked(false)}
                  >
                    Cancel
                  </Button>
                  <SubmitButton />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="relative container max-w-5xl mx-auto py-8 px-4">
        {/* Timeline container with proper positioning */}
        <div className="relative pb-10">
          {/* Add education button positioned at the top of timeline */}
          <div className="flex justify-center mb-6">
            <Button
              onClick={handleAddEducation}
              className="dark:bg-gray-700 bg-gray-200 text-gray-700 dark:text-gray-200 hover:dark:text-gray-700 hover:text-gray-200 rounded-full z-10 shadow-md"
              size="icon"
              title="Add Education"
            >
              <Plus />
            </Button>
          </div>

          {/* Center line with fixed positioning and improved visibility */}
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
    </div>
  );
}

// Submit button component with loading state
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      className="bg-blue-600 hover:bg-blue-700"
    >
      {pending ? "Adding..." : "Add Education"}
    </Button>
  );
}
