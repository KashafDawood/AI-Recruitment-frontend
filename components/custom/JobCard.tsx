import React from "react";
import { Job } from "@/types/job";
import { BookmarkIcon, Briefcase, MapPin, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  job: Job;
  index: number;
  isSelected: boolean;
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
  onClick,
}) => {
  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? "border-purple-500 shadow-md"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      <div className="flex gap-3">
        <div className="flex-grow">
          <div className="flex justify-between gap-2">
            <div className="flex gap-2">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
                  index % 3 === 0
                    ? "bg-green-500"
                    : index % 3 === 1
                    ? "bg-purple-600"
                    : "bg-orange-500"
                }`}
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
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg h-10 w-10"
            >
              <BookmarkIcon className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-6 mt-3">
            {job.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Badge
                variant="outline"
                className="bg-gray-50 border-0 text-xs px-2 py-0 gap-1 flex items-center"
              >
                <Briefcase className="h-4 w-4 text-gray-500 mr-1" />
                {job.job_type}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Badge
                variant="outline"
                className="bg-gray-50 border-0 text-xs px-2 py-0 gap-1 flex items-center"
              >
                <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                {job.location}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-xs">
                {index === 0 ? "74" : index === 1 ? "50" : "48"} applied
              </span>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-xs">
                {calculateDaysAgo(job.created_at)} days ago
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
