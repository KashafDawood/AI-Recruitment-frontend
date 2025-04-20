"use client";

import { useState, useEffect } from "react";
import { useUserWithLoading } from "@/hooks/useUser";
import Spinner from "@/components/ui/spinner";
import { Job } from "@/types/job";
import { Search, Filter, X } from "lucide-react";
import { getAllEmployerJobs } from "@/api/jobs/getAllEmployerjobs";
import { toast } from "sonner";
import JobCard from "@/components/custom/JobCard";
import PaginationUI from "@/components/custom/PaginationUI";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

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

  // New state for advanced filtering
  const [jobType, setJobType] = useState<string | null>(null);
  const [jobLocation, setJobLocation] = useState<string | null>(null);

  const applySearch = () => {
    const filters = { ...activeFilters };

    // Add searchTerm to filters only if it's not empty
    if (searchTerm.trim()) {
      filters.search = searchTerm.trim();
    } else {
      delete filters.search; // Remove search filter if searchTerm is empty
    }

    // Add job type filter if selected
    if (jobType) {
      filters.job_type = jobType;
    } else {
      delete filters.job_type;
    }

    // Add job location type filter if selected
    if (jobLocation) {
      filters.job_location_type = jobLocation;
    } else {
      delete filters.job_location_type;
    }

    setActiveFilters(filters);
    setCurrentPage(1); // Reset pagination when applying search
  };

  const clearFilters = () => {
    setSearchTerm("");
    setJobType(null);
    setJobLocation(null);
    setActiveFilters({});
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

  // Count number of active filters for the badge
  const filterCount =
    Object.keys(activeFilters).length - (activeFilters.search ? 1 : 0);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#121212] dark:text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-8 border-b border-gray-300 dark:border-gray-800">
            <button
              className={`pb-2 px-1 ${
                activeTab === "open"
                  ? "border-b-2 border-gray-600 dark:border-white font-medium"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("open")}
            >
              Current Job Listings
            </button>
            <button
              className={`pb-2 px-1 ${
                activeTab === "draft"
                  ? "border-b-2 border-gray-600 dark:border-white font-medium"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("draft")}
            >
              Job Drafts
            </button>
            <button
              className={`pb-2 px-1 ${
                activeTab === "closed"
                  ? "border-b-2 border-gray-600 dark:border-white font-medium"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("closed")}
            >
              Closed Positions
            </button>
          </div>
        </div>

        {/* Advanced search section */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by job title, location, or description"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>

          {/* Filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
                {filterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {filterCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Job Filters</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs font-normal text-gray-500">
                Job Type
              </DropdownMenuLabel>
              <DropdownMenuItem
                className={
                  jobType === "full time" ? "bg-gray-100 dark:bg-gray-800" : ""
                }
                onClick={() =>
                  setJobType(jobType === "full time" ? null : "full time")
                }
              >
                Full Time
              </DropdownMenuItem>
              <DropdownMenuItem
                className={
                  jobType === "part time" ? "bg-gray-100 dark:bg-gray-800" : ""
                }
                onClick={() =>
                  setJobType(jobType === "part time" ? null : "part time")
                }
              >
                Part Time
              </DropdownMenuItem>
              <DropdownMenuItem
                className={
                  jobType === "internship" ? "bg-gray-100 dark:bg-gray-800" : ""
                }
                onClick={() =>
                  setJobType(jobType === "internship" ? null : "internship")
                }
              >
                Internship
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs font-normal text-gray-500">
                Location Type
              </DropdownMenuLabel>
              <DropdownMenuItem
                className={
                  jobLocation === "remote" ? "bg-gray-100 dark:bg-gray-800" : ""
                }
                onClick={() =>
                  setJobLocation(jobLocation === "remote" ? null : "remote")
                }
              >
                Remote
              </DropdownMenuItem>
              <DropdownMenuItem
                className={
                  jobLocation === "onsite" ? "bg-gray-100 dark:bg-gray-800" : ""
                }
                onClick={() =>
                  setJobLocation(jobLocation === "onsite" ? null : "onsite")
                }
              >
                On-site
              </DropdownMenuItem>
              <DropdownMenuItem
                className={
                  jobLocation === "hybrid" ? "bg-gray-100 dark:bg-gray-800" : ""
                }
                onClick={() =>
                  setJobLocation(jobLocation === "hybrid" ? null : "hybrid")
                }
              >
                Hybrid
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={applySearch}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Search
          </Button>

          {(searchTerm || filterCount > 0) && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" /> Clear
            </Button>
          )}
        </div>

        {/* Active filters display */}
        {(filterCount > 0 || searchTerm) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {searchTerm && (
              <Badge
                variant="secondary"
                className="px-2 py-1 flex items-center gap-1"
              >
                Search: {searchTerm}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setSearchTerm("");
                    const newFilters = { ...activeFilters };
                    delete newFilters.search;
                    setActiveFilters(newFilters);
                  }}
                />
              </Badge>
            )}
            {jobType && (
              <Badge
                variant="secondary"
                className="px-2 py-1 flex items-center gap-1"
              >
                Type: {jobType}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setJobType(null);
                    const newFilters = { ...activeFilters };
                    delete newFilters.job_type;
                    setActiveFilters(newFilters);
                  }}
                />
              </Badge>
            )}
            {jobLocation && (
              <Badge
                variant="secondary"
                className="px-2 py-1 flex items-center gap-1"
              >
                Location: {jobLocation}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setJobLocation(null);
                    const newFilters = { ...activeFilters };
                    delete newFilters.job_location_type;
                    setActiveFilters(newFilters);
                  }}
                />
              </Badge>
            )}
          </div>
        )}

        {/* No results message */}
        {!loading && jobs.length === 0 && (
          <div className="py-12 text-center">
            <div className="mb-4 rounded-full bg-gray-100 dark:bg-gray-800 p-3 inline-flex">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No job listings found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {activeFilters.search || filterCount > 0
                ? "Try adjusting your search criteria or clearing filters"
                : `You don't have any ${activeTab} job listings yet`}
            </p>
            {(activeFilters.search || filterCount > 0) && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear All Filters
              </Button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-3 flex justify-center items-center py-20">
              <Spinner />
            </div>
          ) : (
            jobs.map((job, index) => (
              <div
                key={job.id || index}
                className="cursor-pointer"
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
        {/* Pagination */}
        {totalPages > 0 && jobs.length > 0 && (
          <div className="pt-4 mt-4">
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
