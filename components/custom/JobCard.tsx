import React from "react";
import { Job } from "@/types/job";
import {
  BookmarkIcon,
  Briefcase,
  MapPin,
  User,
  Clock,
  CheckCircle,
} from "lucide-react";
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

  // Determine status style
  const isOpen = job.job_status.toLowerCase() === "open";
  const statusColor = isOpen
    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
  const statusDot = isOpen ? "bg-green-500" : "bg-gray-500";

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
                  <div className="flex items-center gap-4 pb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {job.title}
                    </h3>
                    {job.has_applied && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1 border-none">
                        <CheckCircle className="h-3 w-3" />
                        Applied
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 my-2">
                    <Badge
                      variant="secondary"
                      className={`flex items-center gap-1.5 rounded-full text-xs px-2 ${statusColor}`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${statusDot}`}
                      ></div>
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
                <span>{job.applicants} applied</span>
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
