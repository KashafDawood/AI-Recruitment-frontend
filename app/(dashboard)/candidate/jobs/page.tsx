"use client";

import { getAllJobs } from "@/api/candidate/getAllJobs";
import { saveJob } from "@/api/candidate/saveJob";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import "./scrollbar.css";
import useWindowWidth from "@/hooks/use-window-width";

import { Job } from "@/types/job";
import JobDetails from "../../../../components/jobs/jobDetails";
import JobList from "@/components/jobs/JobList";

export default function FindJobs() {
  const width = useWindowWidth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const JobsPerPage = 10;

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(totalJobs / JobsPerPage);

  // Fetch jobs and total count on initial load and when currentPage changes
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const data = await getAllJobs(currentPage, JobsPerPage, activeFilters);
        if (data && data.results) {
          setJobs(data.results);
          setSelectedJob(data.results[0]);
          setTotalJobs(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setJobs([]);
        setTotalJobs(0);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, activeFilters]);

  // Function to handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleJobClick = (job: Job) => {
    console.log("Job clicked:", job); // Debugging log
    setSelectedJob(job);
    if (width !== null && width <= 1023) {
      setIsSheetOpen(true); // Open sheet on small screens
    }
  };

  const applyFilter = () => {
    if (!searchTerm) return;

    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [`search_${Date.now()}`]: searchTerm.toLowerCase(), // Generate a unique key for each search
    }));
    setSearchTerm(""); // Clear the input field
    setCurrentPage(1); // Reset pagination when applying filters
  };

  const removeFilter = (filterKey: string) => {
    setActiveFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      delete updatedFilters[filterKey]; // Remove filter properly
      return updatedFilters;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({}); // Reset filters to an empty object
  };

  const handleSaveJob = async (jobId: number) => {
    try {
      const response = await saveJob(jobId);

      // Update the saved state for the job in the jobs list
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, is_saved: !job.is_saved } : job
        )
      );

      // Update the saved state for the selected job
      setSelectedJob((prevSelectedJob) =>
        prevSelectedJob && prevSelectedJob.id === jobId
          ? { ...prevSelectedJob, is_saved: !prevSelectedJob.is_saved }
          : prevSelectedJob
      );

      toast.success(response.message);
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job.");
    }
  };

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-5rem)] overflow-y-hidden">
      <div className="flex gap-4 h-full">
        <div className="w-full lg:w-3/5 flex flex-col h-full overflow-y-auto custom-scrollbar">
          <JobList
            jobs={jobs}
            totalJobs={totalJobs}
            currentPage={currentPage}
            selectedJob={selectedJob}
            onPageChange={setCurrentPage}
            onFilterChange={setActiveFilters}
            onClearFilters={() => setActiveFilters({})}
            onJobSelect={setSelectedJob}
            loading={loading}
            showSavedJobs={true}
            onSaveJob={handleSaveJob}
          />
        </div>
        {width !== null && width > 1023 && selectedJob && (
          <JobDetails
            selectedJob={selectedJob}
            onSaveJob={handleSaveJob} 
          />
        )}
      </div>
    </div>
  );
}
