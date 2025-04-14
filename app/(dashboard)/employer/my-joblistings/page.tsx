"use client"

import { useState, useEffect } from "react";
import { useUserWithLoading } from "@/hooks/useUser";
import Spinner from "@/components/ui/spinner";
import { Job } from "@/types/job";
import { Search } from "lucide-react"
import { getAllEmployerJobs } from "@/api/jobs/getAllEmployerjobs";
import { toast } from "sonner";
import JobCard from "@/components/custom/JobCard";
import PaginationUI from "@/components/custom/PaginationUI";
import { useRouter } from "next/navigation";

const MyJobListings: React.FC = () => {
  const router = useRouter();
  const { user, isLoading} = useUserWithLoading();
  const [activeTab, setActiveTab] = useState("open")
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const JobsPerPage = 9;
  const totalPages = Math.ceil(totalJobs / JobsPerPage);

  const applySearch = () => {
    const filters = { ...activeFilters };

    // Add searchTerm to filters only if it's not empty
    if (searchTerm.trim()) {
      filters.search = searchTerm.trim();
    } else {
      delete filters.search; // Remove search filter if searchTerm is empty
    }

    setActiveFilters(filters);
    setCurrentPage(1); // Reset pagination when applying search
  };

  useEffect(() => {
    const fetchJobs = async () => {
      if (user?.username) {
        setLoading(true);
        try {
          const res = await getAllEmployerJobs(
            currentPage,
            JobsPerPage,
            user.username,
            {
              ...activeFilters,
              job_status: activeTab === "open" ? "open" : activeTab === "draft" ? "draft" : "closed",
            }
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
  }, [user, currentPage, activeFilters, activeTab]);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    router.push(`/employer/my-joblistings/job-detail?id=${job.id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applySearch();
    }
  };

  if(isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#121212] dark:text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-8 border-b border-gray-300 dark:border-gray-800">
            <button
              className={`pb-2 px-1 ${
                activeTab === "open" ? "border-b-2 border-gray-600 dark:border-white font-medium" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("open")}
            >
              Current Job Listings
            </button>
            <button
              className={`pb-2 px-1 ${
                activeTab === "draft" ? "border-b-2 border-gray-600 dark:border-white font-medium" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("draft")}
            >
              Job Drafts
            </button>
            <button
              className={`pb-2 px-1 ${
                activeTab === "closed" ? "border-b-2 border-gray-600 dark:border-white font-medium" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("closed")}
            >
              Closed Positions
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Find a job"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
              className="dark:bg-[#1E1E1E] border border-gray-300 dark:border-transparent rounded-md pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-1 shadow-sm dark:focus:ring-gray-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job, index) => (
            <JobCard 
              key={job.id || index}
              job={job}
              index={index}
              isSelected={
                selectedJob?.id === job.id
              }
              onClick={() => handleJobClick(job)}
            />
          ))}
        </div>
        {/* Pagination */}
        {totalPages > 0 && (
          <div className="pt-4 mt-auto">
            <PaginationUI
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default MyJobListings;
