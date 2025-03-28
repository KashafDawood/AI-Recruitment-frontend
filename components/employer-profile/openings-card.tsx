import { User } from "@/store/userStore";
import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAllEmployerJobs } from "@/api/jobs/getAllEmployerjobs";
import { Job } from "@/types/job";
import JobList from "../jobs/JobList";
import { toast } from "sonner";

export const OpeningsCard: React.FC<{ user: User | null }> = ({ user }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const JobsPerPage = 10;

  useEffect(() => {
    const fetchJobs = async () => {
      if (user?.username) {
        setLoading(true);
        try {
          const res = await getAllEmployerJobs(
            currentPage,
            JobsPerPage,
            user.username,
            activeFilters
          );
          setJobs(res.results || []);
          setTotalJobs(res.count || 0);
        } catch {
          toast.error("Failed to fetch job openings. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchJobs();
  }, [user, currentPage, activeFilters]);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  const applyFilter = (filters: Record<string, string>) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Reset pagination when applying filters
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setCurrentPage(1); // Reset pagination when clearing filters
  };

  return (
    <Card className="dark:bg-gray-900">
      <CardHeader>
        <h2 className="text-xl font-semibold">Current Openings</h2>
      </CardHeader>
      <CardContent>
        <JobList
          jobs={jobs}
          totalJobs={totalJobs}
          currentPage={currentPage}
          selectedJob={selectedJob}
          onPageChange={setCurrentPage}
          onFilterChange={applyFilter}
          onClearFilters={clearAllFilters}
          onJobSelect={handleJobClick}
          loading={loading}
          forceSheetOnLargeScreens={true}
        />
      </CardContent>
    </Card>
  );
};
