"use client";

import { getAllJobs } from "@/api/candidate/getAllJobs";
import { useEffect, useState } from "react";
import {
  FilterIcon,
  X,
  ChevronDown,
  BookmarkIcon,
  Share2Icon,
  Briefcase,
  MapPin,
  User,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "./scrollbar.css";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Job } from "@/types/job";
import JobDetails from "./jobDetails";
import JobCard from "@/components/custom/JobCard";

export default function FindJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
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
          console.log("Active filters:", activeFilters);

          const fetchedJobs = await getAllJobs(currentPage, JobsPerPage, activeFilters);
          console.log(fetchedJobs);
          // Check if fetchedJobs has expected structure
          if (fetchedJobs && Array.isArray(fetchedJobs)) {
            setJobs(fetchedJobs)
            if (fetchedJobs.length > 0) {
              setSelectedJob(fetchedJobs[0]) 
            }
  
            // If we got exactly JobsPerPage items, there are likely more posts
            // If we got fewer, we're probably on the last page
            if (fetchedJobs.length === JobsPerPage) {
              // Estimate at least one more page worth of jobs
              setTotalJobs(currentPage * JobsPerPage + JobsPerPage);
            } else {
              // We're likely on the last page
              setTotalJobs((currentPage - 1) * JobsPerPage + fetchedJobs.length);
            }
          } else if (fetchedJobs && typeof fetchedJobs === "object") {
            // If getAllJobs returns an object with jobs and total
            const { jobs = [], total = 0 } = fetchedJobs as {
              jobs: Job[];
              total: number;
            };
            setJobs(jobs)
            if (jobs.length > 0) {
              setSelectedJob(jobs[0]) 
            }
            setTotalJobs(total);
          } else {
            // Fallback for unexpected fetchedJobs format
            console.error("Unexpected fetchedJobs format from getAllJobs:", fetchedJobs);
            setJobs([]);
            setTotalJobs(0);
          }
        } catch (error) {
          console.error("Failed to fetch blog posts:", error);
          setJobs([]);
          setTotalJobs(0);
        } finally {
          setLoading(false);
        }
      };
  
      fetchJobs();
    }, [currentPage, JobsPerPage, activeFilters]); // Remove totalPages dependency to avoid circular updates
  
    // Function to handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const applyFilter = () => {
      if (!searchTerm) return;


      setActiveFilters(prevFilters => ({
        ...prevFilters,   
        [`search_${Date.now()}`]: searchTerm.toLowerCase(), // Generate a unique key for each search
      }));
      setSearchTerm(""); // Clear the input field
      setCurrentPage(1); // Reset pagination when applying filters
    };
    
    

    const handlePageChange = (page: number) => {
      // Ensure page is within valid range
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };
  
    // Generate pagination items
    const renderPaginationItems = () => {
      const items = [];
  
      // Always show first page
      items.push(
        <PaginationItem key="first">
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
  
      // Add ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
  
      // Add pages around current page
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        if (i <= totalPages && i > 1) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i}
                onClick={() => handlePageChange(i)}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }
  
      // Add ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
  
      // Always show last page if it's not the first page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key="last">
            <PaginationLink
              isActive={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
  
      return items;
    };

    const removeFilter = (filterKey: string) => {
      setActiveFilters(prevFilters => {
        const updatedFilters = { ...prevFilters };
        delete updatedFilters[filterKey]; // Remove filter properly
        return updatedFilters;
      });
    };
    
    const clearAllFilters = () => {
      setActiveFilters({}); // Reset filters to an empty object
    };

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-5rem)] overflow-y-hidden">
      <div className="flex gap-6 h-full">
        {/* Left column - Job listings with independent scrolling */}
        <div className="w-full lg:w-3/5 flex flex-col h-full overflow-y-auto custom-scrollbar">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-grow">
              <Input 
                type="text"   
                placeholder="Search job" 
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-4 pr-10 py-2 rounded-lg border"
              />
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2  dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white"
              onClick={applyFilter}  
            >
              <FilterIcon className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {Object.keys(activeFilters).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 items-center">
              {Object.entries(activeFilters).map(([key, value], index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 dark:text-white"
                >
                  {value}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeFilter(key)} />
                </Badge>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-blue-600 text-sm font-medium ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="sticky top-0 bg-white z-10 py-2 mb-2 flex justify-between items-center dark:bg-[#121212]">
              <span className="text-sm text-gray-300">Sort by:</span>
              <button className="text-sm font-medium flex items-center">
                Popular Jobs <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="space-y-4 pb-4">
              {loading ? (
                <div>Loading...</div>
              ) : (
              jobs.map((job, index) => (
                <JobCard
                  key={index}
                  job={job}
                  index={index}
                  isSelected={selectedJob?.title === job.title} 
                  onClick={() => setSelectedJob(job)} 
                />
              ))
              )}
            </div>
          </div>

          {/* Only show pagination if there are posts */}
          {totalPages > 0 && (
            <Pagination className="my-2">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        {/* Right column - Job details with independent scrolling and sticky Apply button */}
        {selectedJob && <JobDetails selectedJob={selectedJob} />}

      </div>
  </div>
  )
}
