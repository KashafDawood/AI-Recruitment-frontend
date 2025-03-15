"use client";
import { useState } from "react";
import { GlowCard, vibrantColors } from "../../custom/GlowCard";
import { Button } from "../../ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DatePicker } from "@/components/custom/datePicker";
import { addEducation } from "@/api/user/addEducation";
import { useUserStore } from "@/store/userStore";

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
  const { refreshUser } = useUserStore();

  // Handle checkbox change
  const handleStudyingChange = (checked: boolean) => {
    setIsCurrentlyStudying(checked);
  };

  // Handle form submission directly with API call
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    const formData = new FormData(e.currentTarget);
    const educationData = {
      degree_name: formData.get("degree_name") as string,
      institute_name: formData.get("institute_name") as string,
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
    <div className="flex justify-center items-center my-8 w-full">
      <GlowCard color={vibrantColors[0]} isAlternate={false}>
        <div className="dark:bg-gray-900 bg-gray-100 p-8 transition-all shadow-lg w-full">
          <h2 className="text-2xl font-bold mb-1 text-center">Add Education</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">
            Add your academic qualifications to your profile
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative">
              <div className="absolute left-0 top-2 text-gray-500 dark:text-gray-400"></div>
              <Input
                id="degree_name"
                name="degree_name"
                placeholder="Degree Name"
                className="pl-7 border-0 border-b-2 border-gray-300 dark:border-gray-700 rounded-none px-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-green-600 transition-all"
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
                className="pl-7 border-0 border-b-2 border-gray-300 dark:border-gray-700 rounded-none px-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-green-600 transition-all"
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
              </div>
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
      </GlowCard>
    </div>
  );
}
