import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, Share2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/job";
import ProfileCard from "@/components/jobs/ProfileCard";
import { applyForJob } from "@/api/candidate/ApplyForJob";
import { toast } from "sonner";
import SelectResume from "../custom/selectResume";

interface JobDetailsProps {
  selectedJob: Job;
  forceSheetOnLargeScreens?: boolean;
}

const JobDetails: React.FC<JobDetailsProps> = ({
  selectedJob,
  forceSheetOnLargeScreens = false,
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);

  if (!selectedJob) {
    return <div>No job selected</div>;
  }

  const applyJob = async () => {
    try {
      const applicationData = {
        resume: selectedResume,
        job: selectedJob.id,
      };

      await applyForJob(applicationData);
      toast.success("You have successfully applied for this job!");
      setIsApplying(false);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to apply for the job. Please try again."
      );
      setIsApplying(false);
    }
  };

  const triggerSelectResume = () => {
    setIsApplying(true);
  };

  const containerClass = forceSheetOnLargeScreens
    ? "w-full border-none"
    : "lg:w-2/5 lg:border"; // Conditionally apply the width class

  return (
    <div
      className={`${containerClass} lg:flex flex-col h-full dark:border-gray-800 rounded-lg relative overflow-y-auto custom-scrollbar`}
    >
      {isApplying ? (
        <SelectResume
          selectedResume={selectedResume}
          setSelectedResume={setSelectedResume}
        />
      ) : (
        <div className="overflow-y-auto h-full custom-scrollbar pb-20">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold dark:text-white">
                  {selectedJob.title}
                </h2>
                <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2 text-sm text-gray-800 dark:text-gray-300 mt-1">
                  <span>{selectedJob.company}</span>
                  <span className="hidden lg:block">•</span>
                  <span>{selectedJob.location}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-lg h-10 w-10"
                >
                  <BookmarkIcon className="h-5 w-5 text-blue-600" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-lg h-10 w-10"
                >
                  <Share2Icon className="h-5 w-5 text-blue-600" />
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium dark:text-gray-200">
                  Applicants Summary
                </h3>
                <Badge
                  variant="outline"
                  className={`font-medium ${
                    selectedJob.job_status.toLowerCase() === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {selectedJob.job_status}
                </Badge>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold dark:text-white">
                      67
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      /100
                    </span>
                  </div>
                  {/* This would be a pie chart in a real implementation */}
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full -rotate-90"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#e0e0e0"
                      strokeWidth="12"
                      className="dark:stroke-gray-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#4f46e5"
                      strokeWidth="12"
                      strokeDasharray="251.2"
                      strokeDashoffset="75"
                      className="dark:stroke-indigo-500"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#3b82f6"
                      strokeWidth="12"
                      strokeDasharray="251.2"
                      strokeDashoffset="175"
                      className="dark:stroke-blue-500"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth="12"
                      strokeDasharray="251.2"
                      strokeDashoffset="240"
                      className="dark:stroke-red-500"
                    />
                  </svg>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-sm dark:text-gray-300">
                      New Applicants
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500"></span>
                    <span className="text-sm dark:text-gray-300">Approved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-sm dark:text-gray-300">Rejected</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="border dark:border-gray-800 rounded-lg p-3 bg-white dark:bg-gray-900">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Job Type
                </div>
                <div className="font-medium dark:text-white">
                  {selectedJob.job_type}
                </div>
              </div>
              <div className="border dark:border-gray-800 rounded-lg p-3 bg-white dark:bg-gray-900">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Experience
                </div>
                <div className="font-medium dark:text-white">
                  {selectedJob.experience_required}
                </div>
              </div>
              <div className="border dark:border-gray-800 rounded-lg p-3 bg-white dark:bg-gray-900">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Salary
                </div>
                <div className="font-medium dark:text-white">
                  {selectedJob.salary}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3 dark:text-white">
                About Job Role
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedJob.description}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3 dark:text-white">Requirements</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed list-disc pl-5 space-y-2">
                {selectedJob.required_qualifications.map(
                  (requirement, index) => (
                    <li key={index}>{requirement}</li>
                  )
                )}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3 dark:text-white">
                Preferred Qualifications
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed list-disc pl-5 space-y-2">
                {selectedJob.preferred_qualifications.map(
                  (qualification, index) => (
                    <li key={index}>{qualification}</li>
                  )
                )}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3 dark:text-white">
                Responsibilities
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed list-disc pl-5 space-y-2">
                {selectedJob.responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3 dark:text-white">Benefits</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed list-disc pl-5 space-y-2">
                {selectedJob.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>

            {/* employer profile card */}
            {selectedJob.employer && (
              <ProfileCard employer={selectedJob.employer} />
            )}
          </div>
        </div>
      )}

      {/* Sticky Apply Job button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
        {isApplying ? (
          <Button
            onClick={applyJob}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Submit
          </Button>
        ) : (
          <Button
            onClick={triggerSelectResume}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Apply for Job
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
