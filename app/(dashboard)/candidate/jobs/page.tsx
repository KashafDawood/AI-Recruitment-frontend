"use client";

import { getAllJobs } from "@/api/candidate/getAllJobs";
import { useEffect, useState } from "react";
import { FilterIcon, X, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "./scrollbar.css";
import useWindowWidth from "@/hooks/use-window-width";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { Job } from "@/types/job";
import JobDetails from "../../../../components/jobs/jobDetails";
import JobCard from "@/components/custom/JobCard";
import PaginationUI from "@/components/custom/PaginationUI";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

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
    setSelectedJob(job);
    if (width!==null && width <= 1023) {
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
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => removeFilter(key)}
                  />
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
                    onClick={() => handleJobClick(job)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Only show pagination if there are posts */}
          {totalPages > 0 && (
            <PaginationUI
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
        
        {/* Right column - Job details with independent scrolling and sticky Apply button */}
        {width!==null && width>1023 &&  selectedJob && <JobDetails selectedJob={selectedJob} />}
        
        {/* Sheets for job details if width is < 1023 */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          {width!==null && width>500 && width<=1023 && (
          <SheetContent side="right" className="max-h-full overflow-y-auto p-0 pt-4"> 
              <VisuallyHidden>
                <SheetTitle>Job Details</SheetTitle>
              </VisuallyHidden>
               { selectedJob && <JobDetails selectedJob={selectedJob} /> }
            </SheetContent>
          )}
          {width!==null && width<=640 && (
          <SheetContent side="bottom" className="max-h-full h-full overflow-y-auto p-0 pt-4"> 
              <VisuallyHidden>
                <SheetTitle>Job Details</SheetTitle>
              </VisuallyHidden>
              { selectedJob && <JobDetails selectedJob={selectedJob} /> }
            </SheetContent>
          )}
        </Sheet>
      </div>

      

    </div>
  );
}
