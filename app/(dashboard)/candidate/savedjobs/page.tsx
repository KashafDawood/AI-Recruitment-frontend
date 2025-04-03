"use client";

import { getSavedJobs } from "@/api/candidate/getSavedJobs";
import { useEffect, useState } from "react";
import { Job } from "@/types/job";
import JobList from "@/components/jobs/JobList";
import { toast } from "sonner";
import { saveJob } from "@/api/candidate/saveJob";

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
    <div>
      {totalJobs === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-[75vh]">
          <h1 className="text-2xl font-bold mb-4">Saved Jobs</h1>
          <p className="text-gray-600">You have no saved jobs.</p>
          <p className="text-gray-600">Browse jobs and save your favorites!</p>
        </div>
      )}
      <div className="flex flex-col items-center justify-center md:w-[70%] mx-auto mt-6 mb-4">
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
          includeFilters={false} // Disable filters for saved jobs
          forceSheetOnLargeScreens={true} // Enable sheet for large screens
        />
      </div>
      
    </div>
  );
}