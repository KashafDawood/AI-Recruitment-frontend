"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormStatus } from "react-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Job } from "@/types/job";
import { Separator } from "@/components/ui/separator";

interface CreateJobFormProps {
  formAction: (payload: FormData) => void;
  onFormChange?: (values: Record<string, unknown>) => void;
  initialValues?: Record<string, unknown>;
  state?: {
    message?: string;
    job?: Job;
    errors?: {
      title?: string | string[];
      location?: string | string[];
      company?: string | string[];
      experience?: string | string[];
      experience_level?: string | string[];
      salary?: string | string[];
      description?: string | string[];
      responsibilities?: string | string[];
      required_qualifications?: string | string[];
      preferred_qualifications?: string | string[];
      benefits?: string | string[];
      job_type?: string | string[];
      job_location_type?: string | string[];
      job_status?: string | string[];
    };
    serverError?: string;
    fieldErrors?: Record<string, string>;
    policyViolations?: string[];
    approved?: boolean;
  };
}

const CreateJobForm: React.FC<CreateJobFormProps> = ({
  formAction,
  state,
  onFormChange,
  initialValues = {},
}) => {
  const [formValues, setFormValues] = useState<Record<string, unknown>>({
    ...initialValues,
  });

  // Initialize form values from initialValues
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      setFormValues((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  // Update form values whenever any input changes
  const updateFormValues = (name: string, value: string | string[]) => {
    const newValues = { ...formValues, [name]: value };
    setFormValues(newValues);

    // If onFormChange is provided, call it
    if (onFormChange) {
      const formattedValues = { ...newValues };

      // For textarea fields, convert newline-separated text to arrays for the preview
      if (
        name === "responsibilities" ||
        name === "required_qualifications" ||
        name === "preferred_qualifications" ||
        name === "benefits"
      ) {
        if (typeof value === "string") {
          const lines = value.split("\n").filter((line) => line.trim() !== "");
          formattedValues[name] = lines;
        }
      }

      onFormChange(formattedValues);
    }
  };

  // Handle simple input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateFormValues(name, value);
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    updateFormValues(name, value);
  };

  // Helper function to convert array to multi-line string
  const arrayToMultilineString = (arr: string[] | undefined): string => {
    if (!arr) return "";
    return arr.join("\n");
  };

  return (
    <form action={formAction} className="pb-16">
      <div className="grid gap-8">
        {/* Basic Information */}
        <Card className="w-full p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Basic Information
          </h2>
          <CardContent className="p-0 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Senior Software Engineer"
                  required
                  onChange={handleInputChange}
                  value={formValues.title || ""}
                  className="h-11"
                />
                {state?.errors?.title && (
                  <p className="text-red-500 text-sm">{state.errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium">
                  Company
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Your Company"
                  onChange={handleInputChange}
                  value={formValues.company || ""}
                  className="h-11"
                />
                {state?.errors?.company && (
                  <p className="text-red-500 text-sm">{state.errors.company}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="New York, NY"
                  required
                  onChange={handleInputChange}
                  value={formValues.location || ""}
                  className="h-11"
                />
                {state?.errors?.location && (
                  <p className="text-red-500 text-sm">
                    {state.errors.location}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-medium">
                  Salary Range
                </Label>
                <Input
                  id="salary"
                  name="salary"
                  type="text"
                  placeholder="$80,000 - $120,000"
                  onChange={handleInputChange}
                  value={formValues.salary || ""}
                  className="h-11"
                />
                {state?.errors?.salary && (
                  <p className="text-red-500 text-sm">{state.errors.salary}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-medium">
                  Experience Required <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="experience"
                  name="experience"
                  type="text"
                  placeholder="3+ years"
                  required
                  onChange={handleInputChange}
                  value={formValues.experience || ""}
                  className="h-11"
                />
                {state?.errors?.experience && (
                  <p className="text-red-500 text-sm">
                    {state.errors.experience}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="experience_level"
                  className="text-sm font-medium"
                >
                  Experience Level
                </Label>
                <Select
                  name="experience_level"
                  value={(formValues.experience_level as string) || "entry"}
                  onValueChange={(value) =>
                    handleSelectChange("experience_level", value)
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive Level</SelectItem>
                  </SelectContent>
                </Select>
                {state?.errors?.experience_level && (
                  <p className="text-red-500 text-sm">
                    {state.errors.experience_level}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_type" className="text-sm font-medium">
                  Job Type
                </Label>
                <Select
                  name="job_type"
                  value={(formValues.job_type as string) || "full time"}
                  onValueChange={(value) =>
                    handleSelectChange("job_type", value)
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full time">Full Time</SelectItem>
                    <SelectItem value="part time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                {state?.errors?.job_type && (
                  <p className="text-red-500 text-sm">
                    {state.errors.job_type}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="job_location_type"
                  className="text-sm font-medium"
                >
                  Location Type
                </Label>
                <Select
                  name="job_location_type"
                  value={(formValues.job_location_type as string) || "onsite"}
                  onValueChange={(value) =>
                    handleSelectChange("job_location_type", value)
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="onsite">Onsite</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                {state?.errors?.job_location_type && (
                  <p className="text-red-500 text-sm">
                    {state.errors.job_location_type}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_status" className="text-sm font-medium">
                  Job Status
                </Label>
                <Select
                  name="job_status"
                  value={(formValues.job_status as string) || "open"}
                  onValueChange={(value) =>
                    handleSelectChange("job_status", value)
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                {state?.errors?.job_status && (
                  <p className="text-red-500 text-sm">
                    {state.errors.job_status}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card className="w-full p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Job Description
          </h2>
          <CardContent className="p-0 space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium">
                Job Description <span className="text-red-500">*</span>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  Provide a detailed description of the role
                </span>
              </Label>
              <Textarea
                name="description"
                placeholder="Enter job description details..."
                value={formValues.description || ""}
                onChange={handleInputChange}
                className="min-h-[150px]"
                required
              />
              {state?.errors?.description && (
                <p className="text-red-500 text-sm">
                  {state.errors.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Requirements and Responsibilities */}
        <Card className="w-full p-6">
          <h2 className="text-xl font-semibold mb-6 text-blue-600 dark:text-blue-400">
            Requirements & Responsibilities
          </h2>

          <CardContent className="p-0 space-y-8">
            {/* Requirements Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Requirements</h3>

              {/* Required Qualifications Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <Label className="text-sm font-medium">
                    Required Qualifications
                  </Label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Enter each qualification on a new line
                  </span>
                </div>

                <Textarea
                  name="required_qualifications"
                  placeholder="• Bachelor's degree in Computer Science or related field
• 3+ years of experience in web development
• Proficiency in JavaScript and React"
                  value={
                    typeof formValues.required_qualifications === "string"
                      ? formValues.required_qualifications
                      : arrayToMultilineString(
                          formValues.required_qualifications as
                            | string[]
                            | undefined
                        )
                  }
                  onChange={handleInputChange}
                  className="min-h-[150px]"
                />
                {state?.errors?.required_qualifications && (
                  <p className="text-red-500 text-sm">
                    {state.errors.required_qualifications}
                  </p>
                )}
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex justify-between items-baseline">
                  <Label className="text-sm font-medium">
                    Preferred Qualifications
                  </Label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Enter each qualification on a new line
                  </span>
                </div>

                <Textarea
                  name="preferred_qualifications"
                  placeholder="• Master's degree in a technical field
• Experience with TypeScript
• Knowledge of cloud platforms (AWS, Azure, GCP)"
                  value={
                    typeof formValues.preferred_qualifications === "string"
                      ? formValues.preferred_qualifications
                      : arrayToMultilineString(
                          formValues.preferred_qualifications as
                            | string[]
                            | undefined
                        )
                  }
                  onChange={handleInputChange}
                  className="min-h-[150px]"
                />
                {state?.errors?.preferred_qualifications && (
                  <p className="text-red-500 text-sm">
                    {state.errors.preferred_qualifications}
                  </p>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Responsibilities Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Responsibilities</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <Label className="text-sm font-medium">
                    Key Responsibilities
                  </Label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Enter each responsibility on a new line
                  </span>
                </div>

                <Textarea
                  name="responsibilities"
                  placeholder="• Lead development of front-end features
• Collaborate with cross-functional teams
• Write clean, maintainable code"
                  value={
                    typeof formValues.responsibilities === "string"
                      ? formValues.responsibilities
                      : arrayToMultilineString(
                          formValues.responsibilities as string[] | undefined
                        )
                  }
                  onChange={handleInputChange}
                  className="min-h-[150px]"
                />
                {state?.errors?.responsibilities && (
                  <p className="text-red-500 text-sm">
                    {state.errors.responsibilities}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <Card className="w-full p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Benefits & Perks
          </h2>
          <CardContent className="p-0 space-y-4">
            <div className="flex justify-between items-baseline">
              <Label className="text-sm font-medium">Benefits Offered</Label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Enter each benefit on a new line
              </span>
            </div>

            <Textarea
              name="benefits"
              placeholder="• Competitive salary and bonuses
• Medical, dental, and vision insurance
• 401(k) matching
• Flexible working hours"
              value={
                typeof formValues.benefits === "string"
                  ? formValues.benefits
                  : arrayToMultilineString(
                      formValues.benefits as string[] | undefined
                    )
              }
              onChange={handleInputChange}
              className="min-h-[150px]"
            />
            {state?.errors?.benefits && (
              <p className="text-red-500 text-sm">{state.errors.benefits}</p>
            )}
          </CardContent>
        </Card>

        {/* Error and status messages */}
        {state?.serverError && (
          <div className="p-4 bg-red-100 border border-red-300 rounded-md text-red-800">
            <p className="font-medium">Error</p>
            <p className="text-sm">{state.serverError}</p>
          </div>
        )}

        {state?.policyViolations && state.policyViolations.length > 0 && (
          <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800">
            <p className="font-semibold">Policy Violations:</p>
            <ul className="list-disc ml-5 mt-2 text-sm">
              {state.policyViolations.map((violation, index) => (
                <li key={index}>{violation}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[calc(50%-1rem)] p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-700 shadow-lg z-10">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md"
    >
      {pending ? "Publishing..." : "Publish Job"}
    </Button>
  );
}

export default CreateJobForm;
