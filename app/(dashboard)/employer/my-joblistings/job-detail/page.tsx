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
import {
  FileText,
  Briefcase,
  Users,
  Calendar,
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
  Loader2,
  Edit,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import JobStatusToggle from "@/components/jobs/JobStatusToggle";

const JobDetailPage: React.FC = () => {
  const [jobData, setJobData] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

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

  // const getStatusColor = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case "open":
  //       return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  //     case "closed":
  //       return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  //     case "draft":
  //       return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
  //     default:
  //       return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  //   }
  // };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header with back button and actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Job Details Management
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Review and manage your job posting and applications
            </p>
          </div>
        </div>

        {!loading && !error && jobData && (
          <div className="flex gap-3 ml-12 md:ml-0">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.open(`/job/${jobData.id}`, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              View Public Page
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() =>
                router.push(
                  `/employer/my-joblistings/edit-job?id=${jobData.id}`
                )
              }
            >
              <Edit className="h-4 w-4" />
              Edit Job
            </Button>
            <Sheet
              open={isDetailsSheetOpen}
              onOpenChange={setIsDetailsSheetOpen}
            >
              <SheetTrigger asChild>
                <Button className="flex items-center gap-2 px-4" size="sm">
                  <FileText className="h-4 w-4" />
                  Full Job Details
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
                    <JobDetails
                      className="!w-full"
                      selectedJob={jobData}
                      isPreview={true}
                    />
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading job details...</p>
          </div>
        </div>
      ) : error ? (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>
      ) : jobData ? (
        <div className="grid grid-cols-1 gap-6">
          {/* Job Overview Card */}
          <Card className="overflow-hidden border-0 shadow-md bg-white dark:bg-gray-800">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 px-6 py-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                Job Overview
              </h2>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">{jobData.title}</h2>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span>{jobData.company}</span>
                      <span className="text-gray-400">•</span>
                      <span>{jobData.location}</span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mt-4">
                      {jobData.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-lg flex flex-col">
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        Type
                      </span>
                      <span className="font-medium mt-1">
                        {jobData.job_type}
                      </span>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 px-4 py-3 rounded-lg flex flex-col">
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Salary
                      </span>
                      <span className="font-medium mt-1">{jobData.salary}</span>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 px-4 py-3 rounded-lg flex flex-col">
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                        Experience
                      </span>
                      <span className="font-medium mt-1">
                        {jobData.experience_required}
                      </span>
                    </div>
                    {/* Replace the static status badge with our interactive JobStatusToggle component */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-3 rounded-lg flex flex-col">
                      <JobStatusToggle
                        jobId={jobData.id}
                        currentStatus={
                          jobData.job_status as "open" | "closed" | "draft"
                        }
                        onStatusChange={(newStatus) => {
                          // Update the local job data with the new status
                          setJobData({
                            ...jobData,
                            job_status: newStatus,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="md:w-72 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl p-5 flex flex-col items-center justify-center">
                  <div className="relative mb-3">
                    <div className="h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                      <Users className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                      {jobData.applicants.toString()}
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-1">Total Applicants</h3>
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    {parseInt(jobData.applicants.toString()) > 0
                      ? "Review applicants below"
                      : "No applicants yet"}
                  </p>
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    Posted on {formatDate(jobData.created_at)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applicants Card */}
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 px-6 py-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                Job Applicants
              </h2>
            </div>
            <CardContent className="p-6">
              {jobData && parseInt(jobData.applicants.toString()) > 0 ? (
                <JobApplicantsList jobId={jobData.id} className="mt-2" />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 dark:bg-gray-800/40 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="mb-5 p-3 rounded-full bg-blue-50 dark:bg-blue-900/20">
                    <FileText className="h-10 w-10 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-200 mb-2">
                    No applicants yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    When candidates apply for this position, they will appear
                    here. You can then review their profiles and resumes.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => window.open(`/job/${jobData.id}`, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Public Job Listing
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-900/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-700 dark:text-yellow-400">
                  Job Not Found
                </h3>
                <p className="text-yellow-600 dark:text-yellow-300">
                  Could not find job details. The job may have been deleted or
                  you don&apos;t have permission to view it.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobDetailPage;
