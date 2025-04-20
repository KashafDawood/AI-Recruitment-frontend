"use client";

import { useState, useEffect } from "react";
import { useUserWithLoading } from "@/hooks/useUser";
import Spinner from "@/components/ui/spinner";
import { Job } from "@/types/job";
import { Search, X } from "lucide-react";
import { getAllEmployerJobs } from "@/api/jobs/getAllEmployerjobs";
import { toast } from "sonner";
import JobCard from "@/components/custom/JobCard";
import PaginationUI from "@/components/custom/PaginationUI";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MyJobListings: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useUserWithLoading();
  const [activeTab, setActiveTab] = useState("open");
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

  const clearSearch = () => {
    setSearchTerm("");
    const newFilters = { ...activeFilters };
    delete newFilters.search;
    setActiveFilters(newFilters);
    setCurrentPage(1);
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
              job_status:
                activeTab === "open"
                  ? "open"
                  : activeTab === "draft"
                  ? "draft"
                  : "closed",
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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#121212] dark:text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">
            Your Career Kingdom <span className="text-gray-500">|</span> Job
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your job listings, track applications, and grow your team.
          </p>
        </div>

        {/* Tabs with improved UI */}
        <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-800 mb-8">
          <button
            className={`pb-3 px-1 transition-all ${
              activeTab === "open"
                ? "border-b-2 border-blue-600 dark:border-blue-500 font-medium text-blue-600 dark:text-blue-500"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("open")}
          >
            Current Job Listings
          </button>
          <button
            className={`pb-3 px-1 transition-all ${
              activeTab === "draft"
                ? "border-b-2 border-blue-600 dark:border-blue-500 font-medium text-blue-600 dark:text-blue-500"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("draft")}
          >
            Job Drafts
          </button>
          <button
            className={`pb-3 px-1 transition-all ${
              activeTab === "closed"
                ? "border-b-2 border-blue-600 dark:border-blue-500 font-medium text-blue-600 dark:text-blue-500"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("closed")}
          >
            Closed Positions
          </button>
        </div>

        {/* Simplified search section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by job title, location, or description"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
              className="pl-10 pr-4 py-2 w-full rounded-lg border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            onClick={applySearch}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Search
          </Button>
        </div>

        {/* No results message with improved styling */}
        {!loading && jobs.length === 0 && (
          <div className="py-16 text-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="mb-4 rounded-full bg-gray-100 dark:bg-gray-700 p-3 inline-flex">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No job listings found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {activeFilters.search
                ? "Try adjusting your search terms"
                : `You don't have any ${activeTab} job listings yet`}
            </p>
            {activeFilters.search && (
              <Button variant="outline" onClick={clearSearch} className="mt-6">
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* Job cards with improved grid layout */}
        {jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 flex justify-center items-center py-20">
                <Spinner />
              </div>
            ) : (
              jobs.map((job, index) => (
                <div
                  key={job.id || index}
                  className="cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => handleJobClick(job)}
                >
                  <JobCard
                    job={job}
                    index={index}
                    isSelected={selectedJob?.id === job.id}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination with improved styling */}
        {totalPages > 0 && jobs.length > 0 && (
          <div className="pt-6 mt-6 flex justify-center">
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
