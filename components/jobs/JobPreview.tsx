"use client";

import React, { useEffect, useState } from "react";
import JobDetails from "./jobDetails";
import { Job, JobPreviewData } from "@/types/job";
import { Loader2 } from "lucide-react";

interface JobPreviewProps {
  formData: JobPreviewData | null;
  isLoading?: boolean;
}

const JobPreview: React.FC<JobPreviewProps> = ({
  formData,
  isLoading = false,
}) => {
  // Keep a local state for the job data to avoid null checks everywhere
  const [previewJob, setPreviewJob] = useState<Job | null>(null);

  // Update preview job whenever form data changes
  useEffect(() => {
    if (formData) {
      // Creating job data directly inside the effect
      setPreviewJob({
        id: -1,
        title: formData.title || "Job Title",
        company: formData.company || "Your Company",
        location: formData.location || "Location",
        job_type: formData.job_type || "Full-time",
        job_location_type: formData.job_location_type || "On-site",
        job_status: formData.job_status || "open",
        experience_required: formData.experience || "Not specified",
        experience_level: formData.experience_level || "Not specified",
        salary: formData.salary || "Not specified",
        description: Array.isArray(formData.description)
          ? formData.description.join("\n")
          : formData.description || "Job description will appear here.",
        required_qualifications: convertToArray(
          formData.required_qualifications
        ),
        preferred_qualifications: convertToArray(
          formData.preferred_qualifications
        ),
        responsibilities: convertToArray(formData.responsibilities),
        benefits: convertToArray(formData.benefits),
        created_at: new Date().toISOString(),
        has_applied: false,
        is_saved: false,
        applicants: new Uint8Array(),
        employer: {
          username: "",
          photo: "",
          company_name: formData.company || "Your Company",
          address: "",
          name: formData.company || "Your Company",
          industry: formData.industry || "",
          about_company: "",
          company_size: "",
        },
      });
    } else {
      setPreviewJob(null);
    }
  }, [formData]);

  // Helper function to convert string or array to array
  const convertToArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];

    // If already an array, return it filtered
    if (Array.isArray(value)) {
      return value.filter((item) => item.trim() !== "");
    }

    // If string, split by newlines
    return value.split("\n").filter((item) => item.trim() !== "");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/50 dark:to-gray-800/30 border-b dark:border-gray-700">
        <h2 className="text-xl font-medium text-blue-700 dark:text-blue-400">
          Live Job Preview
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This is how your job posting will appear to candidates
        </p>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        </div>
      ) : previewJob ? (
        <JobDetails
          selectedJob={previewJob}
          className="h-full border-none"
          forceSheetOnLargeScreens={true}
          isPreview={true}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50/50 to-indigo-50/50 dark:from-gray-800/20 dark:to-gray-800/10">
          <div className="text-center max-w-md">
            <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-200">
              No Preview Available
            </h3>
            <p className="text-gray-500 mb-6">
              Fill in the job details to see a live preview
            </p>
            <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-10 bg-white dark:bg-gray-800/30 shadow-sm">
              <p className="text-gray-400 dark:text-gray-500">
                Preview will appear here
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPreview;
