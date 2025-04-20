"use client";

import React, { useEffect, useState } from "react";
import { getJobById } from "@/api/jobs/getJobById";
import JobDetails from "@/components/jobs/jobDetails";
import JobApplicantsList from "@/components/jobs/JobApplicantsList";
import { Job } from "@/types/job";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useSearchParams } from "next/navigation";

const JobDetailPage: React.FC = () => {
  const [jobData, setJobData] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        // Extract job ID from query parameters
        const jobId = searchParams.get("id");

        if (!jobId) {
          setError(
            "Job ID not found in URL. Please check the URL and try again."
          );
          setLoading(false);
          return;
        }

        const data = await getJobById(jobId);
        setJobData(data);
        document.title = `${data.title} - Job Details | Stafee`;
        setError(null);
      } catch (err) {
        console.error("Failed to fetch job details:", err);
        setError("Failed to load job details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [searchParams]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Job Details Management</h1>

        {!loading && !error && jobData && (
          <Sheet open={isDetailsSheetOpen} onOpenChange={setIsDetailsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="flex items-center gap-2 px-6 mt-4 md:mt-0">
                <FileText className="h-5 w-5" />
                View Job Details
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle>Complete Job Details</SheetTitle>
                <SheetDescription>
                  View all information about the job posting
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                {jobData && (
                  <JobDetails selectedJob={jobData} isPreview={true} />
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : jobData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1 lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">{jobData.title}</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {jobData.company} • {jobData.location}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-md">
                  <span className="font-medium">Type:</span> {jobData.job_type}
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-md">
                  <span className="font-medium">Salary:</span> {jobData.salary}
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-md">
                  <span className="font-medium">Experience:</span>{" "}
                  {jobData.experience_required}
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-md">
                  <span className="font-medium">Status:</span>{" "}
                  {jobData.job_status}
                </div>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-3 rounded-md">
                <div>
                  <span className="font-medium">Total Applicants:</span>{" "}
                  {jobData.applicants.toString()}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Job Applicants</h2>

              {jobData && parseInt(jobData.applicants.toString()) > 0 ? (
                <JobApplicantsList jobId={jobData.id} />
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                  <div className="mb-4">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                    No applicants yet
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    There are no applications for this job posting yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <strong className="font-bold">No job found! </strong>
          <span className="block sm:inline">Could not find job details.</span>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;
