import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  BookmarkIcon,
  Check,
  Share2Icon,
  Briefcase,
  Clock,
  DollarSign,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Employer, Job } from "@/types/job";
import ProfileCard from "@/components/jobs/ProfileCard";
import { applyForJob } from "@/api/candidate/ApplyForJob";
import { toast } from "sonner";
import SelectResume from "../custom/selectResume";
import { useUserWithLoading } from "@/hooks/useUser";

interface JobDetailsProps {
  selectedJob: Job;
  forceSheetOnLargeScreens?: boolean;
  onSaveJob?: (jobId: number) => void;
  onJobApplied?: (jobId: number) => void;
  className?: string;
  isPreview?: boolean;
}

const JobDetails: React.FC<JobDetailsProps> = ({
  selectedJob,
  forceSheetOnLargeScreens = false,
  onSaveJob,
  onJobApplied,
  className,
  isPreview = false,
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [jobData, setJobData] = useState<Job>(selectedJob);
  const { user } = useUserWithLoading();
  const [isLoading, setIsLoading] = useState(false);

  // Update job data when selectedJob changes
  useEffect(() => {
    setJobData(selectedJob);
  }, [selectedJob]);

  if (!jobData) {
    return <div>No job selected</div>;
  }

  const applyJob = async () => {
    try {
      setIsLoading(true);
      const applicationData = {
        resume: selectedResume,
        job: jobData.id,
      };

      await applyForJob(applicationData);
      toast.success("You have successfully applied for this job!");

      // Update local state immediately
      setJobData((prev) => ({
        ...prev,
        has_applied: true,
      }));

      // Notify parent components
      if (onJobApplied) {
        onJobApplied(jobData.id);
      }

      setIsApplying(false);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "alreadyApplied" in error &&
        error.alreadyApplied === true
      ) {
        toast.error("You have already applied for this job!");
      } else if (
        error instanceof Error &&
        error.message.toLowerCase().includes("already applied")
      ) {
        toast.error("You have already applied for this job!");
      } else {
        toast.error(
          error instanceof Error ||
            (typeof error === "object" && error !== null && "message" in error)
            ? (error as { message: string }).message
            : "Failed to apply for the job. Please try again."
        );
      }
      setIsApplying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerSelectResume = () => {
    setIsApplying(true);
  };

  const handleJobChange = () => {
    setIsApplying(false);
  };

  const containerClass = forceSheetOnLargeScreens
    ? "w-full border-none"
    : "lg:w-2/5 lg:border"; // Conditionally apply the width class

  return (
    <div
      className={`${
        className ? className : ""
      } ${containerClass} lg:flex flex-col h-full dark:border-gray-600 rounded-lg relative overflow-y-auto custom-scrollbar shadow-sm`}
    >
      {isApplying ? (
        <SelectResume
          selectedResume={selectedResume}
          setSelectedResume={setSelectedResume}
          jobId={jobData.id}
          onJobChange={handleJobChange}
        />
      ) : (
        <div className="overflow-y-auto h-full custom-scrollbar pb-20">
          <div className="p-6">
            {/* Enhanced header section */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold dark:text-white mb-2">
                  {jobData.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{jobData.company}</span>
                  <span className="text-gray-400">•</span>
                  <span>{jobData.location}</span>
                  <Badge
                    variant="outline"
                    className={`ml-1 font-medium ${
                      jobData.job_status.toLowerCase() === "open"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {jobData.job_status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full h-10 w-10 border-gray-200 hover:border-blue-200 dark:border-gray-700 ${
                    selectedJob.is_saved
                      ? "bg-blue-500 text-white hover:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600"
                      : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSaveJob) {
                      onSaveJob(selectedJob.id);
                    }
                  }}
                >
                  <BookmarkIcon
                    className={`h-5 w-5 ${
                      selectedJob.is_saved
                        ? "text-white dark:text-white"
                        : "text-blue-600 dark:text-blue-400"
                    }`}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10 border-gray-200 hover:bg-blue-50 hover:border-blue-200 dark:border-gray-700 dark:hover:bg-blue-900/20"
                >
                  <Share2Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </Button>
              </div>
            </div>

            {/* Improved job stats section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
              <div className="border dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-blue-500" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Job Type
                  </div>
                </div>
                <div className="font-medium dark:text-white">
                  {jobData.job_type}
                </div>
              </div>
              <div className="border dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Experience
                  </div>
                </div>
                <div className="font-medium dark:text-white">
                  {jobData.experience_required}
                </div>
              </div>
              <div className="border dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Salary
                  </div>
                </div>
                <div className="font-medium dark:text-white">
                  {jobData.salary}
                </div>
              </div>
            </div>

            {/* Section headers with visual separators */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white flex items-center">
                <div className="w-1.5 h-5 bg-blue-500 rounded-sm mr-2"></div>
                About Job Role
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {jobData.description}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white flex items-center">
                <div className="w-1.5 h-5 bg-indigo-500 rounded-sm mr-2"></div>
                Requirements
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
                {jobData.required_qualifications.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mt-1 mr-2 h-4 w-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs">
                      •
                    </div>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white flex items-center">
                <div className="w-1.5 h-5 bg-purple-500 rounded-sm mr-2"></div>
                Preferred Qualifications
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
                {jobData.preferred_qualifications.map(
                  (qualification, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mt-1 mr-2 h-4 w-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs">
                        •
                      </div>
                      <span>{qualification}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white flex items-center">
                <div className="w-1.5 h-5 bg-green-500 rounded-sm mr-2"></div>
                Responsibilities
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
                {jobData.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mt-1 mr-2 h-4 w-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs">
                      •
                    </div>
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white flex items-center">
                <div className="w-1.5 h-5 bg-yellow-500 rounded-sm mr-2"></div>
                Benefits
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
                {jobData.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mt-1 mr-2 h-4 w-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs">
                      •
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enhanced employer profile card */}
            {jobData.employer && (
              <div
                className={`"border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm" ${
                  jobData.has_applied ? "mb-9" : ""
                }`}
              >
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 px-4 py-3 border-b dark:border-gray-700">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    About the Employer
                  </h3>
                </div>
                <div>
                  {isPreview && user ? (
                    <ProfileCard employer={user as Employer} />
                  ) : (
                    jobData.employer && (
                      <ProfileCard employer={jobData.employer} />
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hide apply button if in preview mode */}
      {!isPreview && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-700 shadow-lg bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm">
          {jobData.job_status.toLowerCase() === "closed" ? (
            <div className="flex items-center justify-center gap-2 py-4 px-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Position closed for applications
              </span>
            </div>
          ) : jobData.has_applied ? (
            <div className="flex flex-col items-center justify-center gap-1 py-4 px-5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-green-100 dark:bg-green-800/50 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium text-green-700 dark:text-green-400">
                  Already Applied
                </span>
              </div>
              <span className="text-xs text-green-600 dark:text-green-500 mt-1">
                Your application is under review
              </span>
            </div>
          ) : isApplying ? (
            <Button
              onClick={applyJob}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 rounded-xl font-medium text-lg shadow-md transition-all duration-200 dark:from-blue-600 dark:to-indigo-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          ) : (
            <Button
              onClick={triggerSelectResume}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 rounded-xl font-medium text-lg shadow-md transition-all duration-200 dark:from-blue-600 dark:to-indigo-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Loading...
                </>
              ) : (
                "Apply for This Position"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetails;
