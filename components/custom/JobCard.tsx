import { Job } from "@/types/job";
import {
  BookmarkIcon,
  Briefcase,
  MapPin,
  User,
  Clock,
  CheckCircle,
  Pen,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowCard, vibrantColors } from "./GlowCard";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { deleteJob } from "@/api/jobs/deleteJob";
import { toast } from "sonner";

interface JobCardProps {
  job: Job;
  index: number;
  isSelected: boolean;
  showSaveJob?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  onClick?: () => void;
  onSaveJob?: (jobId: number) => void;
  onDeleteJob?: (jobId: number) => void;
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
  showEditButton = false,
  showDeleteButton = false,
  onClick,
  onSaveJob,
  onDeleteJob,
}) => {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // Select a color from vibrantColors based on job index
  const cardColor = vibrantColors[index % vibrantColors.length];

  // Determine status style
  const isOpen = job.job_status.toLowerCase() === "open";
  const statusColor = isOpen
    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    : job.job_status.toLowerCase() === "draft"
    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
  const statusDot = isOpen
    ? "bg-green-500"
    : job.job_status.toLowerCase() === "draft"
    ? "bg-yellow-500"
    : "bg-gray-500";

  // Properly handle click events
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't allow navigation if job is being deleted or has been deleted
    if (deleteLoading || isDeleted || e.defaultPrevented) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Only trigger onClick if it exists
    if (onClick) {
      onClick();
    }
  };

  // Handle save button click
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the card click event
    if (onSaveJob) {
      onSaveJob(job.id);
    }
  };

  // Handle edit button click
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the card click event
    router.push(`/employer/my-joblistings/edit-job?id=${job.id}`);
  };

  // Handle delete button click
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the card click event
    setIsDeleteDialogOpen(true);
  };

  // Handle delete job confirmation
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteJob(job.id);

      // Mark job as deleted to prevent navigation
      setIsDeleted(true);

      if (onDeleteJob) {
        onDeleteJob(job.id);
      } else {
        // Refresh page if no delete callback provided
        window.location.reload();
      }

      toast.success(`Job "${job.title}" successfully deleted`);
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job. Please try again.");
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <GlowCard color={cardColor} className="mb-4 !pl-0 shadow-lg">
        <div
          className={`p-4 bg-white dark:bg-gray-800 rounded-lg transition-all ${
            isDeleted
              ? "opacity-50 cursor-default"
              : "cursor-pointer " +
                (isSelected
                  ? "shadow-md ring-2"
                  : "hover:bg-gray-50 dark:hover:bg-gray-750")
          }`}
          style={{
            boxShadow:
              isSelected && !isDeleted ? `0 4px 14px 0 ${cardColor}30` : "none",
          }}
          onClick={handleCardClick}
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
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-100/50 dark:hover:bg-blue-900/50 flex items-center gap-1 border-none">
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
                      {isDeleted && (
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs px-2"
                        >
                          Deleted
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {showEditButton && !isDeleted && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-10 w-10 border-gray-200 dark:border-gray-700 z-10 dark:bg-gray-800 dark:hover:bg-gray-700"
                      onClick={handleEditClick}
                    >
                      <Pen className="h-4 w-4" style={{ color: cardColor }} />
                    </Button>
                  )}
                  {showDeleteButton && !isDeleted && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-10 w-10 border-gray-200 dark:border-gray-700 z-10 dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      onClick={handleDeleteClick}
                      disabled={deleteLoading}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                    </Button>
                  )}
                  {showSaveJob && !isDeleted && (
                    <Button
                      variant="outline"
                      size="icon"
                      className={`rounded-lg h-10 w-10 border-gray-200 dark:border-gray-700 z-10 ${
                        job.is_saved
                          ? "bg-blue-500 text-white hover:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600"
                          : "dark:bg-gray-800 dark:hover:bg-gray-700"
                      }`}
                      onClick={handleSaveClick}
                    >
                      <BookmarkIcon
                        className="h-5 w-5"
                        style={{ color: job.is_saved ? "white" : cardColor }}
                      />
                    </Button>
                  )}
                </div>
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

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!deleteLoading) {
            setIsDeleteDialogOpen(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the job listing
              <span className="font-medium text-foreground"> {job.title}</span>.
              {parseInt(job.applicants.toString() || "0") > 0 && (
                <span className="block mt-2 text-orange-600 dark:text-orange-400">
                  Warning: This job has {job.applicants} applicant(s). Deleting
                  it will remove their applications too.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent any further propagation
                handleDelete();
              }}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteLoading ? "Deleting..." : "Delete Job"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default JobCard;
