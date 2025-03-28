"use client";

import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import JobCard from "../custom/JobCard";
import PaginationUI from "../custom/PaginationUI";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import useWindowWidth from "@/hooks/use-window-width";
import { Job } from "@/types/job";
import JobDetails from "./jobDetails";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobListProps {
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  selectedJob: Job | null;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: Record<string, string>) => void;
  onClearFilters: () => void;
  onJobSelect: (job: Job) => void;
  loading: boolean;
  forceSheetOnLargeScreens?: boolean;
  showSavedJobs?: boolean;
}

const JobsPerPage = 10;

const JobList: React.FC<JobListProps> = ({
  jobs,
  totalJobs,
  currentPage,
  selectedJob,
  onPageChange,
  onFilterChange,
  onClearFilters,
  onJobSelect,
  loading,
  forceSheetOnLargeScreens = false,
  showSavedJobs = false,
}) => {
  const width = useWindowWidth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState("latest");

  const totalPages = Math.ceil(totalJobs / JobsPerPage);

  // Available filter options
  const locationTypes = ["remote", "hybrid", "onsite"];
  const jobTypes = ["full time", "part time", "contract", "internship"];
  const experienceLevels = ["entry", "mid", "senior", "executive"];
  const timeFilters = [
    { value: "24h", label: "Last 24 hours" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
  ];

  // Sort options mapping
  const sortOptions = [
    { value: "latest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "salary_high_to_low", label: "Salary (High to Low)" },
    { value: "salary_low_to_high", label: "Salary (Low to High)" },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const applySearch = () => {
    if (!searchTerm.trim()) return;

    const newFilters = {
      ...activeFilters,
      search: searchTerm.trim(),
    };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applySearch();
    }
  };

  const applyFilter = (type: string, value: string) => {
    const newFilters = { ...activeFilters, [type]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
    setIsFilterDialogOpen(false);
  };

  const removeFilter = (filterKey: string) => {
    const updatedFilters = { ...activeFilters };
    delete updatedFilters[filterKey];
    setActiveFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchTerm("");
    onClearFilters();
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    const newFilters = { ...activeFilters, sort_by: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleJobClick = (job: Job) => {
    // Only call onJobSelect if it's a different job to avoid unnecessary rerenders
    if (!selectedJob || selectedJob.id !== job.id) {
      onJobSelect(job);
    }

    // Open sheet on smaller screens regardless
    if (width !== null && width <= 1023) {
      setIsSheetOpen(true);
    }
  };

  // Handle successful job application
  const handleJobApplied = (jobId: number) => {
    // Update selected job if it's the one that was applied for
    if (selectedJob && selectedJob.id === jobId) {
      onJobSelect({ ...selectedJob, has_applied: true });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background pb-4">
        {/* Search and Filter Controls */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search jobs, companies, or locations"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
              className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          </div>

          <Button
            variant="default"
            className="px-3"
            onClick={applySearch}
            aria-label="Search jobs"
          >
            <Search className="w-4 h-4" />
          </Button>

          <Dialog
            open={isFilterDialogOpen}
            onOpenChange={setIsFilterDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="px-3 flex items-center gap-1"
                aria-label="Filter jobs"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filter Jobs</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Job Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {jobTypes.map((type) => (
                      <Badge
                        key={type}
                        variant={
                          activeFilters.job_type === type
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer capitalize"
                        onClick={() => applyFilter("job_type", type)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Location Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {locationTypes.map((type) => (
                      <Badge
                        key={type}
                        variant={
                          activeFilters.job_location_type === type
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer capitalize"
                        onClick={() => applyFilter("job_location_type", type)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Experience Level</h3>
                  <div className="flex flex-wrap gap-2">
                    {experienceLevels.map((level) => (
                      <Badge
                        key={level}
                        variant={
                          activeFilters.experience_level === level
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer capitalize"
                        onClick={() => applyFilter("experience_level", level)}
                      >
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Date Posted</h3>
                  <div className="flex flex-wrap gap-2">
                    {timeFilters.map((filter) => (
                      <Badge
                        key={filter.value}
                        variant={
                          activeFilters.time_published === filter.value
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() =>
                          applyFilter("time_published", filter.value)
                        }
                      >
                        {filter.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All
                </Button>
                <Button onClick={() => setIsFilterDialogOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Filters Display */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            {Object.entries(activeFilters).map(([key, value]) => {
              // Skip the sort_by filter from displaying as a badge
              if (key === "sort_by") return null;

              // Format the filter key for display
              const displayKey = key.replace(/_/g, " ");
              const displayValue =
                key === "time_published"
                  ? timeFilters.find((f) => f.value === value)?.label || value
                  : value;

              return (
                <Badge
                  key={key}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1 rounded-full"
                >
                  <span className="capitalize">
                    {displayKey === "search" ? "" : `${displayKey}: `}
                  </span>
                  {displayValue}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => removeFilter(key)}
                  />
                </Badge>
              );
            })}
            <button
              onClick={clearAllFilters}
              className="text-primary text-sm font-medium ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Sorting Control */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${totalJobs} jobs found`}
          </span>
          <Select value={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Job Listings */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 pb-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No jobs found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          jobs.map((job, index) => (
            <JobCard
              key={job.id || index}
              job={job}
              index={index}
              isSelected={selectedJob?.id === job.id}
              onClick={() => handleJobClick(job)}
              showSaveJob={showSavedJobs}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="pt-4 mt-auto">
          <PaginationUI
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* Job Details Sheet for Mobile/Tablet View */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side={width !== null && width <= 640 ? "bottom" : "right"}
          className={`
            ${width !== null && width <= 640 ? "h-[85vh]" : ""} 
            ${
              width !== null && width > 640 && width <= 1023
                ? "w-[500px] sm:w-[600px] md:w-[650px]"
                : ""
            }
            max-h-full overflow-y-auto p-0 pt-4
          `}
        >
          <VisuallyHidden>
            <SheetTitle>Job Details</SheetTitle>
          </VisuallyHidden>
          {selectedJob && (
            <JobDetails
              selectedJob={selectedJob}
              onJobApplied={handleJobApplied}
              forceSheetOnLargeScreens={forceSheetOnLargeScreens}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default JobList;
