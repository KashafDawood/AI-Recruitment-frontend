"use client";

import { getSavedJobs } from "@/api/candidate/getSavedJobs";
import { useEffect, useState } from "react";
import { Job } from "@/types/job";
import JobList from "@/components/jobs/JobList";
import { toast } from "sonner";
import { saveJob } from "@/api/candidate/saveJob";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InfoIcon, BookmarkIcon } from "lucide-react";

export default function SavedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const JobsPerPage = 10;

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        const res = await getSavedJobs(currentPage, JobsPerPage);
        console.log(res);
        setJobs(res.results || []);
        setTotalJobs(res.count || 0);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
        toast.error("Failed to fetch saved jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, [currentPage]);

  const handleJobClick = (job: Job) => {
    console.log("Job clicked in OpeningsCard:", job); // Debugging log
    setSelectedJob(job);
  };

  const handleSaveJob = async (jobId: number) => {
    try {
      const response = await saveJob(jobId);

      // Remove the unsaved job from the list and update total count
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      setTotalJobs((prev) => Math.max(0, prev - 1));

      // If the selected job was unsaved, clear the selection
      if (selectedJob?.id === jobId) {
        setSelectedJob(null);
      }

      // If after removing a job, the current page would be empty but not the first page,
      // go back to the previous page
      if (jobs.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }

      toast.success(response.message);
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BookmarkIcon className="h-7 w-7 text-blue-700 dark:text-blue-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            Job Bookmarks
          </h1>
        </div>
        <Dialog>
          <DialogTrigger className="text-blue-700 dark:text-blue-400 font-medium text-sm hover:underline flex items-center gap-1">
            <InfoIcon className="w-4 h-4 mr-1" />
            Not seeing a Job?
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Not seeing a job?
              </DialogTitle>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                To keep things tidy, we remove saved jobs that are older than 6
                months. This helps maintain an organized view of your current
                job interests.
              </div>
            </DialogHeader>
            <div className="border-t pt-4 mt-4">
              <p className="text-sm mb-3">
                Have a question or need assistance?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {totalJobs === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-gray-900/50 rounded-lg p-12 shadow-sm border border-gray-100 dark:border-gray-700 h-[60vh]">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
            <BookmarkIcon className="h-10 w-10 text-blue-500 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Saved Jobs</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
            You haven&apos;t saved any jobs yet. Start browsing opportunities
            and save the ones that interest you!
          </p>
          <Link
            href="/candidate/jobs"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="bg-blue-50 dark:bg-gray-900/50 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300">
              {loading
                ? "Loading saved jobs..."
                : `${totalJobs} saved ${totalJobs === 1 ? "job" : "jobs"}`}
            </p>
          </div>
          <div className="px-10 py-6">
            <JobList
              jobs={jobs}
              totalJobs={totalJobs}
              currentPage={currentPage}
              selectedJob={selectedJob}
              onPageChange={setCurrentPage}
              onJobSelect={handleJobClick}
              loading={loading}
              showSavedJobs={true}
              onSaveJob={handleSaveJob}
              includeFilters={false}
              forceSheetOnLargeScreens={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
