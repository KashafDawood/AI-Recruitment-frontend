"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getJobById } from "@/api/jobs/getJobById";
import { Job } from "@/types/job";
import EditJobForm from "@/components/jobs/EditJobForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";

const EditJobPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobData, setJobData] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
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
        document.title = `Edit ${data.title} - Stafee`;
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

  const handleJobUpdated = (updatedJob: Job) => {
    // Navigate back to the job details page after successful update
    router.push(`/employer/my-joblistings/job-detail?id=${updatedJob.id}`);
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Edit Job Listing</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Update the details of your job posting
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading job details...</p>
          </div>
        </div>
      ) : error ? (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-red-700 dark:text-red-400">
                Error
              </h3>
              <p className="text-red-600 dark:text-red-300">{error}</p>
            </div>
          </div>
        </Card>
      ) : jobData ? (
        <EditJobForm job={jobData} onJobUpdated={handleJobUpdated} />
      ) : (
        <Card className="border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-900/10 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-700 dark:text-yellow-400">
                Job Not Found
              </h3>
              <p className="text-yellow-600 dark:text-yellow-300">
                Could not find job details. The job may have been deleted or you
                don&apos;t have permission to view it.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EditJobPage;
