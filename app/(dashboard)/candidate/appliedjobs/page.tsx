"use client";

import { useEffect, useState } from "react";
import { getAppliedJobs } from "@/api/candidate/getAppliedJobs";
import { saveJob } from "@/api/candidate/saveJob";
import { toast } from "sonner";
import { Job } from "@/types/job";
import JobDetail from "./jobDetail";
import JobList from "@/components/jobs/JobList";
import useWindowWidth from "@/hooks/use-window-width";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { JobStats } from "./jobStats";
import "./scrollbar.css";

export default function FindJobs() {
  const width = useWindowWidth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const [order, setOrder] = useState("desc"); // Default order

  // Fetch jobs based on current filters and pagination
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const data = await getAppliedJobs(currentPage, jobsPerPage, order);
        if (data && data.results) {
          setJobs(data.results);

          // Only auto-select the first job on desktop view after initial load
          if (data.results.length > 0 && width !== null && width > 1023) {
            setSelectedJob(data.results[0]);
          } else if (data.results.length === 0) {
            // Clear selected job if no results
            setSelectedJob(null);
          }

          setTotalJobs(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setJobs([]);
        setTotalJobs(0);
        setSelectedJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, width, order]);

  // Handle job selection
  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  const handleSaveJob = async (jobId: number) => {
    try {
      const response = await saveJob(jobId);

      // Fetch the updated job state after saving/unsaving
      const updatedJobs = await getAppliedJobs(currentPage, jobsPerPage, order);
      if (updatedJobs && updatedJobs.results) {
        setJobs(updatedJobs.results);
      }

      toast.success(response.message);
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job.");
    }
  };

  const handleSortChange = async (sortOption: string) => {
    if (sortOption === "recent") {
      setOrder("desc");
    }
    if (sortOption === "oldest") {
      setOrder("asc");
    }
    setCurrentPage(1); // Reset to the first page when sorting changes
  };

  return (
    <div className="h-screen">
      <div className="xl:container mx-auto py-6 space-y-6 p-[22px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-blue-500 dark:text-blue-500">Applied Jobs</h1>
            <p className="text-muted-foreground dark:text-muted-foreground mt-1">
              Track and manage all your job applications in one place
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="recent" onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px] border-blue-500/20 dark:border-blue-500/30">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {jobs.length > 0 && <JobStats jobs={jobs} applications={totalJobs} />}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Job List Section - Responsive width */}
          <div className="lg:w-3/5 flex flex-col h-[78rem] overflow-y-auto custom-scrollbar">
            <JobList
              jobs={jobs}
              totalJobs={totalJobs}
              currentPage={currentPage}
              selectedJob={selectedJob}
              onPageChange={setCurrentPage}
              onJobSelect={handleJobSelect}
              loading={loading}
              showSavedJobs={true}
              onSaveJob={handleSaveJob}
              includeFilters={false}
            />
          </div>

          {/* Job Details Section - Only visible on larger screens */}
          {width !== null && width > 1023 && selectedJob && (
            <div className="lg:w-2/5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-blue-500/10 dark:border-blue-500/20 p-6 h-fit sticky top-6">
              <JobDetail job={selectedJob} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
