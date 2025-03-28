"use client";

import { useEffect, useState } from "react";
import { getAllJobs } from "@/api/candidate/getAllJobs";
import { Job } from "@/types/job";
import JobDetails from "../../../../components/jobs/jobDetails";
import JobList from "@/components/jobs/JobList";
import useWindowWidth from "@/hooks/use-window-width";
import "./scrollbar.css";

export default function FindJobs() {
  const width = useWindowWidth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const jobsPerPage = 10;

  // Lock scrolling on the main document
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Fetch jobs based on current filters and pagination
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const data = await getAllJobs(currentPage, jobsPerPage, filters);
        if (data && data.results) {
          setJobs(data.results);
          if (data.results.length > 0) {
            setSelectedJob(data.results[0]);
          } else {
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
  }, [currentPage, filters]);

  // Handle job selection
  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle job application
  const handleJobApplied = (jobId: number) => {
    // Update jobs list with applied status
    const updatedJobs = jobs.map((job) =>
      job.id === jobId ? { ...job, has_applied: true } : job
    );
    setJobs(updatedJobs);

    // Update selected job if it's the one that was applied for
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob({ ...selectedJob, has_applied: true });
    }
  };

  return (
    <div className="xl:container mx-auto p-4 h-[calc(100vh-5rem)] overflow-y-hidden">
      <div className="flex gap-4 h-full">
        {/* Job List Section - Responsive width */}
        <div className="lg:w-3/5 flex flex-col h-full overflow-y-auto custom-scrollbar">
          <JobList
            jobs={jobs}
            totalJobs={totalJobs}
            currentPage={currentPage}
            selectedJob={selectedJob}
            onPageChange={setCurrentPage}
            onFilterChange={handleFilterChange}
            onClearFilters={() => setFilters({})}
            onJobSelect={handleJobSelect}
            loading={loading}
            showSavedJobs={true}
          />
        </div>

        {/* Job Details Section - Only visible on larger screens */}
        {width !== null && width > 1023 && selectedJob && (
          <JobDetails
            className="min-w-[500px]"
            selectedJob={selectedJob}
            onJobApplied={handleJobApplied}
          />
        )}
      </div>
    </div>
  );
}
