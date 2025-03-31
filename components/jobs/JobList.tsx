"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
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
import { saveJob } from "@/api/candidate/saveJob";
import { toast } from "sonner";

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
  onSaveJob?: (jobId: number) => void; // Add onSaveJob prop
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
  onSaveJob,
}) => {
  const width = useWindowWidth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const totalPages = Math.ceil(totalJobs / JobsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const applyFilter = () => {
    if (!searchTerm) return;

    const newFilters = {
      ...activeFilters,
      [`search_${Date.now()}`]: searchTerm.toLowerCase(),
    };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
    setSearchTerm("");
  };

  const removeFilter = (filterKey: string) => {
    const updatedFilters = { ...activeFilters };
    delete updatedFilters[filterKey];
    setActiveFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    onClearFilters();
  };

  const handleJobClick = (job: Job) => {
    onJobSelect(job);
    setIsSheetOpen(true);
  };

  const handleSaveJob = async (jobId: number) => {
    try {
      const response = await saveJob(jobId);

      toast.success(response.message);
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job.");
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white"
          onClick={applyFilter}
        >
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
        <div className="sticky top-0 bg-white z-20 py-2 mb-2 flex justify-between items-center dark:bg-[#1c1b22]">
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
                showSaveJob={showSavedJobs}
                onSaveJob={handleSaveJob}
              />
            ))
          )}
        </div>
      </div>

      {totalPages > 0 && (
        <PaginationUI
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        {forceSheetOnLargeScreens && width !== null && width > 640 ? (
          <SheetContent
            side="right"
            className="max-h-full overflow-y-auto p-0 pt-4"
          >
            <VisuallyHidden>
              <SheetTitle>Job Details</SheetTitle>
            </VisuallyHidden>
            {selectedJob && (
              <JobDetails
                selectedJob={selectedJob}
                forceSheetOnLargeScreens={true}
                onSaveJob={onSaveJob} // Pass onSaveJob to JobDetails
              />
            )}
          </SheetContent>
        ) : width !== null && width > 640 && width <= 1023 ? (
          <SheetContent
            side="right"
            className="max-h-full overflow-y-auto p-0 pt-4"
          >
            <VisuallyHidden>
              <SheetTitle>Job Details</SheetTitle>
            </VisuallyHidden>
            {selectedJob && (
              <JobDetails
                selectedJob={selectedJob}
                onSaveJob={onSaveJob} // Pass onSaveJob to JobDetails
              />
            )}
          </SheetContent>
        ) : width !== null && width <= 640 ? (
          <SheetContent
            side="bottom"
            className="max-h-full h-full overflow-y-auto p-0 pt-4"
          >
            <VisuallyHidden>
              <SheetTitle>Job Details</SheetTitle>
            </VisuallyHidden>
            {selectedJob && (
              <JobDetails
                selectedJob={selectedJob}
                onSaveJob={onSaveJob} // Pass onSaveJob to JobDetails
              />
            )}
          </SheetContent>
        ) : null}
      </Sheet>
    </div>
  );
};

export default JobList;
