"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Job, JobPreviewData } from "@/types/job";

interface AiJobFormProps {
  formAction: (payload: FormData) => void;
  onJobGenerated?: (jobData: JobPreviewData) => void;
  state?: {
    message?: string;
    job_listing?: Job;
    errors?: {
      job_title?: string | string[];
      company?: string | string[];
      location?: string | string[];
      description?: string | string[];
      experience_required?: string | string[];
      salary_range?: string | string[];
    };
    serverError?: string;
  };
}

const AiJobForm: React.FC<AiJobFormProps> = ({
  formAction,
  onJobGenerated,
  state,
}) => {
  const [formValues, setFormValues] = useState({
    job_title: "",
    company: "",
    location: "",
    description: "",
    experience_required: "",
    salary_range: "",
  });

  // If a job was generated successfully, call the onJobGenerated callback
  useEffect(() => {
    if (state?.job_listing && onJobGenerated) {
      try {
        const generatedJob: JobPreviewData = {
          title: state.job_listing.title || "",
          company: state.job_listing.company || "",
          location: state.job_listing.location || "",
          experience: state.job_listing.experience || "",
          experience_level: state.job_listing.experience_level || "mid",
          salary: state.job_listing.salary || "",
          description: state.job_listing.description || "",
          responsibilities: Array.isArray(state.job_listing.responsibilities)
            ? state.job_listing.responsibilities
            : [],
          required_qualifications: Array.isArray(
            state.job_listing.required_qualifications
          )
            ? state.job_listing.required_qualifications
            : [],
          preferred_qualifications: Array.isArray(
            state.job_listing.preferred_qualifications
          )
            ? state.job_listing.preferred_qualifications
            : [],
          benefits: Array.isArray(state.job_listing.benefits)
            ? state.job_listing.benefits
            : [],
          job_type: state.job_listing.job_type || "full time",
          job_location_type: state.job_listing.job_location_type || "onsite",
          job_status: "open",
        };

        // Safely execute callback in next tick to avoid React state/ref issues
        setTimeout(() => {
          onJobGenerated(generatedJob);
        }, 0);
      } catch (error) {
        console.error("Error processing generated job data:", error);
      }
    }
  }, [state, onJobGenerated]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form action={formAction} className="space-y-6">
      <Card className="w-full p-6">
        <CardContent className="p-0 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="job_title" className="text-sm font-medium">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="job_title"
                name="job_title"
                type="text"
                placeholder="Senior Software Engineer"
                required
                onChange={handleInputChange}
                value={formValues.job_title}
                className="h-11"
              />
              {state?.errors?.job_title && (
                <p className="text-red-500 text-sm">{state.errors.job_title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium">
                Company <span className="text-red-500">*</span>
              </Label>
              <Input
                id="company"
                name="company"
                type="text"
                placeholder="Your Company"
                required
                onChange={handleInputChange}
                value={formValues.company}
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
                value={formValues.location}
                className="h-11"
              />
              {state?.errors?.location && (
                <p className="text-red-500 text-sm">{state.errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_range" className="text-sm font-medium">
                Salary Range
              </Label>
              <Input
                id="salary_range"
                name="salary_range"
                type="text"
                placeholder="$80,000 - $120,000"
                onChange={handleInputChange}
                value={formValues.salary_range}
                className="h-11"
              />
              {state?.errors?.salary_range && (
                <p className="text-red-500 text-sm">
                  {state.errors.salary_range}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="experience_required"
              className="text-sm font-medium"
            >
              Experience Required <span className="text-red-500">*</span>
            </Label>
            <Input
              id="experience_required"
              name="experience_required"
              type="text"
              placeholder="3+ years of experience with React"
              required
              onChange={handleInputChange}
              value={formValues.experience_required}
              className="h-11"
            />
            {state?.errors?.experience_required && (
              <p className="text-red-500 text-sm">
                {state.errors.experience_required}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Job Description <span className="text-red-500">*</span>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                Provide details about the role, technologies, and team
              </span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="We're looking for a skilled software engineer to join our team working on our e-commerce platform. The ideal candidate will have experience with React, Node.js, and database design."
              required
              onChange={handleInputChange}
              value={formValues.description}
              className="min-h-[150px]"
            />
            {state?.errors?.description && (
              <p className="text-red-500 text-sm">{state.errors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error message */}
      {state?.serverError && (
        <div className="p-4 bg-red-100 border border-red-300 rounded-md text-red-800">
          <p className="font-medium">Error</p>
          <p className="text-sm">{state.serverError}</p>
        </div>
      )}

      <GenerateButton />
    </form>
  );
};

function GenerateButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating Job...
        </>
      ) : (
        "Generate Job with AI"
      )}
    </Button>
  );
}

export default AiJobForm;
