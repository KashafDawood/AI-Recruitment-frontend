"use client";
import { useState } from "react";
import { GlowCard, vibrantColors } from "../../custom/GlowCard";
import { Button } from "../../ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DatePicker } from "@/components/custom/datePicker";
import { updateEducation } from "@/api/user/updateEducation";
import { useUserStore } from "@/store/userStore";
import { Education } from "../education-card";

export default function EditEducationForm({
  education,
  onCancel,
  onSuccess,
}: {
  education: Education;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(
    education.is_studying
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [startDate, setStartDate] = useState<Date | undefined>(
    education.start_date ? new Date(education.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    education.end_date ? new Date(education.end_date) : undefined
  );
  const [degreeName, setDegreeName] = useState(education.degree_name);
  const [instituteName, setInstituteName] = useState(education.institute_name);
  const { refreshUser } = useUserStore();

  // Handle checkbox change
  const handleStudyingChange = (checked: boolean) => {
    setIsCurrentlyStudying(checked);
  };

  // Store original degree name for API call
  const originalDegreeName = education.degree_name;

  // Handle form submission directly with API call
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    const updatedEducation = {
      degree_name: degreeName,
      original_degree_name: originalDegreeName, // Pass original name for API identification
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
    if (!updatedEducation.degree_name)
      errors.degree_name = "Degree name is required";
    if (!updatedEducation.institute_name)
      errors.institute_name = "Institute name is required";
    if (!updatedEducation.start_date)
      errors.start_date = "Start date is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      await updateEducation(updatedEducation);
      await refreshUser();
      toast.success("Education updated successfully");
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
          : "Failed to update education";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center my-8 w-full">
      <GlowCard color={vibrantColors[0]} isAlternate={false}>
        <div className="dark:bg-gray-900 bg-gray-100 p-8 transition-all shadow-lg w-full">
          <h2 className="text-2xl font-bold mb-1 text-center">
            Edit Education
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">
            Update your academic information
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative">
              <div className="absolute left-0 top-2 text-gray-500 dark:text-gray-400"></div>
              <Input
                id="degree_name"
                name="degree_name"
                placeholder="Degree Name"
                value={degreeName}
                onChange={(e) => setDegreeName(e.target.value)}
                className="pl-7 border-0 border-b-2 border-gray-300 dark:border-gray-700 rounded-none px-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-blue-600 transition-all"
              />
              {formErrors.degree_name && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.degree_name}
                </p>
              )}
            </div>

            <div className="relative">
              <Input
                id="institute_name"
                name="institute_name"
                placeholder="Institute Name"
                value={instituteName}
                onChange={(e) => setInstituteName(e.target.value)}
                className="pl-7 border-0 border-b-2 border-gray-300 dark:border-gray-700 rounded-none px-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-blue-600 transition-all"
              />
              {formErrors.institute_name && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.institute_name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="start_date"
                  className="text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  Start Date
                </Label>
                <div className="relative">
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
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="end_date"
                  className="text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  End Date
                </Label>
                <div className="relative">
                  <DatePicker
                    date={endDate}
                    onDateChange={(date) => setEndDate(date)}
                    placeholder="Select end date"
                    className="w-full border rounded-md"
                    disabled={isCurrentlyStudying}
                  />
                  {isCurrentlyStudying && (
                    <p className="text-blue-500 text-xs mt-1">
                      Set to &quot;Present&quot; while studying
                    </p>
                  )}
                  {formErrors.end_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.end_date}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-start space-x-3 py-1 mt-2">
              <Checkbox
                id="is_studying"
                name="is_studying"
                checked={isCurrentlyStudying}
                onCheckedChange={handleStudyingChange}
                className="data-[state=checked]:bg-blue-600 h-4 w-4"
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
                className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6"
              >
                {isSubmitting ? "Updating..." : "Update Education"}
              </Button>
            </div>
          </form>
        </div>
      </GlowCard>
    </div>
  );
}
