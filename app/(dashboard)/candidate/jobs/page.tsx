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

const calculateDaysAgo = (dateString: string) => {
  const createdDate = new Date(dateString);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function FindJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  // const [activeFilters, setActiveFilters] = useState<string[]>(["Designer", "Full Time", "Samsung"])
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
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedJob?.title === job.title ? "border-purple-500 shadow-md" : "border-gray-200 hover:border-gray-300"}`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex gap-3">
                    <div className="flex-grow">
                      <div className="flex justify-between gap-2">
                        <div className="flex gap-2">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${index % 3 === 0 ? "bg-green-500" : index % 3 === 1 ? "bg-purple-600" : "bg-orange-500"}`}
                          >
                            {job.title.substring(0, 1)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{job.title}</h3>
                            <div className="flex flex-wrap gap-2 my-2">
                              <Badge
                                variant="secondary"
                                 className="bg-gray-100 text-gray-700 rounded-full text-xs px-2"
                              >
                                {job.job_status}
                              </Badge>
                              <Badge
                                variant="secondary"
                                 className="bg-gray-100 text-gray-700 rounded-full text-xs px-2"
                              >
                                {job.job_location_type}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="bg-gray-100 text-gray-700 rounded-full text-xs px-2"
                              >
                                {job.salary}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="icon" className="rounded-lg h-10 w-10">
                          <BookmarkIcon className="h-5 w-5 text-blue-600" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2 mb-6 mt-3">
                        {job.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1 ">
                          <Badge
                            variant="outline"
                            className="bg-gray-50 border-0 text-xs px-2 py-0 gap-1 flex items-center dark:bg-[#121212]"
                          >
                            <Briefcase className="h-4 w-4 text-gray-500 mr-1" />
                            {job.job_type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="bg-gray-50 border-0 text-xs px-2 py-0 gap-1 flex items-center dark:bg-[#121212]"
                          >
                            <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                            {job.location}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-xs">{job.applicants} applied</span>
                        </div>
                        <div className="flex items-center gap-1 ml-auto">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-xs">{calculateDaysAgo(selectedJob.created_at)} days ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
        {selectedJob && (
          <div className="hidden lg:flex lg:w-2/5 flex-col border rounded-lg relative overflow-y-auto custom-scrollbar">
            <div className="overflow-y-auto h-full custom-scrollbar pb-20">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {selectedJob.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                      <span>{selectedJob.company}</span>
                      <span>•</span>
                      <span>{selectedJob.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg h-10 w-10"
                    >
                      <BookmarkIcon className="h-5 w-5 text-blue-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg h-10 w-10"
                    >
                      <Share2Icon className="h-5 w-5 text-blue-600" />
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 dark:bg-[#232222]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Applicants Summary</h3>
                    <Badge className="bg-green-100 text-green-800 font-medium hover:bg-green-100 hover:text-inherit">
                      {selectedJob.job_status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">67</span>
                        <span className="text-sm text-gray-500">/100</span>
                      </div>
                      {/* This would be a pie chart in a real implementation */}
                      <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full -rotate-90"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#e0e0e0"
                          strokeWidth="12"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#4f46e5"
                          strokeWidth="12"
                          strokeDasharray="251.2"
                          strokeDashoffset="75"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#3b82f6"
                          strokeWidth="12"
                          strokeDasharray="251.2"
                          strokeDashoffset="175"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#ef4444"
                          strokeWidth="12"
                          strokeDasharray="251.2"
                          strokeDashoffset="240"
                        />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span className="text-sm">New Applicants</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                        <span className="text-sm">Approved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="text-sm">Rejected</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="border rounded-lg p-3">
                    <div className="text-sm text-gray-200 mb-1">Job Type</div>
                    <div className="font-medium">{selectedJob.job_type}</div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="text-sm text-gray-200 mb-1">Experience</div>
                    <div className="font-medium">
                      {selectedJob.experience_required}
                    </div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="text-sm text-gray-200 mb-1">Salary</div>
                    <div className="font-medium">{selectedJob.salary}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">About Job Role</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Requirements</h3>
                  <ul className="text-sm text-gray-300 leading-relaxed list-disc pl-5 space-y-2">
                    {selectedJob.required_qualifications.map(
                      (requirement, index) => (
                        <li key={index}>{requirement}</li>
                      )
                    )}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Preferred Qualifications</h3>
                  <ul className="text-sm text-gray-300 leading-relaxed list-disc pl-5 space-y-2">
                    {selectedJob.preferred_qualifications.map(
                      (qualification, index) => (
                        <li key={index}>{qualification}</li>
                      )
                    )}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Responsibilities</h3>
                  <ul className="text-sm text-gray-300 leading-relaxed list-disc pl-5 space-y-2">
                    {selectedJob.responsibilities.map(
                      (responsibility, index) => (
                        <li key={index}>{responsibility}</li>
                      )
                    )}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Benefits</h3>
                  <ul className="text-sm text-gray-300 leading-relaxed list-disc pl-5 space-y-2">
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sticky Apply Job button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t dark:bg-[#121212]">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg dark:bg-blue-500 dark:hover:bg-blue-600">
                Apply Job
              </Button>
            </div>
          </div>
        )}
      </div>
  </div>
  )
}
