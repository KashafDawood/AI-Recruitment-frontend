import React from "react";
import { Job } from "@/types/job";
import { BookmarkIcon, Briefcase, MapPin, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowCard, vibrantColors } from "./GlowCard";

interface JobCardProps {
  job: Job;
  index: number;
  isSelected: boolean;
  showSaveJob?: boolean;
  onClick?: () => void;
}

const calculateDaysAgo = (dateString: string) => {
  const createdDate = new Date(dateString);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const JobCard: React.FC<JobCardProps> = ({
  job,
  index,
  isSelected,
  showSaveJob = false,
  onClick,
}) => {
  // Select a color from vibrantColors based on job index
  const cardColor = vibrantColors[index % vibrantColors.length];

  return (
    <GlowCard color={cardColor} className="mb-4 !pl-0 shadow-lg">
      <div
        className={`p-4 bg-white dark:bg-gray-800 rounded-lg cursor-pointer transition-all ${
          isSelected
            ? "shadow-md ring-2"
            : "hover:bg-gray-50 dark:hover:bg-gray-750"
        }`}
        style={{
          // ringColor: cardColor,
          boxShadow: isSelected ? `0 4px 14px 0 ${cardColor}30` : "none",
        }}
        onClick={onClick}
      >
        <div className="flex gap-3">
          <div className="flex-grow">
            <div className="flex justify-between gap-2">
              <div className="flex gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 my-2">
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs px-2"
                    >
                      {job.job_status}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs px-2"
                    >
                      {job.job_location_type}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs px-2"
                    >
                      {job.salary}
                    </Badge>
                  </div>
                </div>
              </div>
              {showSaveJob && (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-lg h-10 w-10 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <BookmarkIcon
                    className="h-5 w-5"
                    style={{ color: cardColor }}
                  />
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-6 mt-3">
              {job.description}
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
              <Badge
                variant="outline"
                className="text-xs gap-1 flex items-center border-none"
              >
                <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                {job.job_type}
              </Badge>

              <Badge
                variant="outline"
                className="text-xs gap-1 flex items-center border-none"
              >
                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                {job.location}
              </Badge>

              <Badge
                variant="outline"
                className="text-xs gap-1 flex items-center border-none"
              >
                <User className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                <span>
                  {index === 0 ? "74" : index === 1 ? "50" : "48"} applied
                </span>
              </Badge>

              <div className="flex items-center gap-1 ml-auto">
                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-xs">
                  {calculateDaysAgo(job.created_at)} days ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlowCard>
  );
};

export default JobCard;
