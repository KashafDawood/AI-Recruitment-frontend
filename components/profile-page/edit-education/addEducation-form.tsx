"use client";
import { useState, useMemo } from "react";
import { GlowCard, vibrantColors } from "../../custom/GlowCard";
import { Button } from "../../ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DatePicker } from "@/components/custom/datePicker";
import { addEducation } from "@/api/user/addEducation";
import { useUserStore } from "@/store/userStore";
import { Calendar } from "lucide-react";

export default function AddEducationForm({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [degreeName, setDegreeName] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const { refreshUser } = useUserStore();

  // Use useMemo to keep the color constant during re-renders
  const cardColor = useMemo(
    () => vibrantColors[Math.floor(Math.random() * vibrantColors.length)],
    []
  );

  // Handle checkbox change
  const handleStudyingChange = (checked: boolean) => {
    setIsCurrentlyStudying(checked);
  };

  // Format date for display
  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  // Format date range for display
  const formatDateRange = (): string => {
    const start = formatDate(startDate);
    if (isCurrentlyStudying) {
      return start ? `${start} - Present` : "";
    }
    const end = formatDate(endDate);
    return start && end ? `${start} - ${end}` : start || end || "";
  };

  // Handle form submission directly with API call
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    const educationData = {
      degree_name: degreeName,
      institute_name: instituteName,
      start_date: startDate ? startDate.toISOString().split("T")[0] : "",
      end_date: isCurrentlyStudying
        ? null
        : endDate
        ? endDate.toISOString().split("T")[0]
        : null,
      is_studying: isCurrentlyStudying,
    };

    // Validate form data
    const errors: { [key: string]: string } = {};
    if (!educationData.degree_name)
      errors.degree_name = "Degree name is required";
    if (!educationData.institute_name)
      errors.institute_name = "Institute name is required";
    if (!educationData.start_date) errors.start_date = "Start date is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      await addEducation(educationData);
      await refreshUser();
      toast.success("Education added successfully");
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "error" in error.response.data
          ? (error.response.data.error as string)
          : "Failed to add education";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Education</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Form section */}
        <div className="w-full md:w-1/2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="degree_name">Degree Name</Label>
              <Input
                id="degree_name"
                name="degree_name"
                value={degreeName}
                onChange={(e) => setDegreeName(e.target.value)}
                placeholder="e.g., Bachelor of Science in Computer Science"
                className="border-gray-300 dark:border-gray-700"
              />
              {formErrors.degree_name && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.degree_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="institute_name">Institute Name</Label>
              <Input
                id="institute_name"
                name="institute_name"
                value={instituteName}
                onChange={(e) => setInstituteName(e.target.value)}
                placeholder="e.g., Stanford University"
                className="border-gray-300 dark:border-gray-700"
              />
              {formErrors.institute_name && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.institute_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <DatePicker
                date={startDate}
                onDateChange={(date) => setStartDate(date)}
                placeholder="Select start date"
                className="w-full border rounded-md"
              />
              {formErrors.start_date && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.start_date}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <DatePicker
                date={endDate}
                onDateChange={(date) => setEndDate(date)}
                placeholder="Select end date"
                className="w-full border rounded-md"
                disabled={isCurrentlyStudying}
              />
              {isCurrentlyStudying && (
                <p className="text-green-500 text-xs mt-1">
                  Set to &quot;Present&quot; while studying
                </p>
              )}
              {formErrors.end_date && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.end_date}
                </p>
              )}
            </div>

            <div className="flex items-center justify-start space-x-3 py-1 mt-2">
              <Checkbox
                id="is_studying"
                name="is_studying"
                checked={isCurrentlyStudying}
                onCheckedChange={handleStudyingChange}
                className="data-[state=checked]:bg-green-600 h-4 w-4"
              />
              <div className="leading-none">
                <Label
                  htmlFor="is_studying"
                  className="text-sm font-medium cursor-pointer"
                >
                  I am currently studying here
                </Label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="rounded-lg px-6"
              >
                Cancel
              </Button>
              <Button
                disabled={isSubmitting}
                type="submit"
                className="bg-green-600 hover:bg-green-700 rounded-lg px-6"
              >
                {isSubmitting ? "Adding..." : "Add Education"}
              </Button>
            </div>
          </form>
        </div>

        {/* Preview card section */}
        <div className="w-full md:w-1/2">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <GlowCard color={cardColor} isAlternate={false} className="w-full">
            <div className="dark:bg-gray-900 bg-gray-100 p-6 rounded-lg transition-all shadow-lg relative">
              <h3 className="text-xl font-bold text-black dark:text-white">
                {degreeName || "Degree Name"}
              </h3>
              <h4
                className="text-lg font-black mt-1"
                style={{ color: cardColor }}
              >
                {instituteName || "Institute Name"}
              </h4>

              <div className="flex items-center mt-3 text-sm dark:text-gray-200 text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDateRange() || "Start Date - End Date"}</span>
              </div>

              {isCurrentlyStudying && (
                <div
                  className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${cardColor}20`,
                    color: cardColor,
                  }}
                >
                  Currently Studying
                </div>
              )}
            </div>
          </GlowCard>
          <p className="text-sm text-gray-500 mt-4 text-center">
            This is how your education will appear on your profile
          </p>
        </div>
      </div>
    </div>
  );
}
