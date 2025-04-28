import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, Clock, XCircle } from "lucide-react";
import { updateJobStatus } from "@/api/jobs/updateJobStatus";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type JobStatus = "open" | "closed" | "draft";

interface JobStatusToggleProps {
  jobId: string | number;
  currentStatus: JobStatus;
  onStatusChange?: (newStatus: JobStatus) => void;
  disabled?: boolean;
}

const JobStatusToggle: React.FC<JobStatusToggleProps> = ({
  jobId,
  currentStatus,
  onStatusChange,
  disabled = false,
}) => {
  const [status, setStatus] = useState<JobStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  const statusConfig = {
    open: {
      label: "Open",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      icon: <Check className="h-4 w-4 mr-2" />,
    },
    closed: {
      label: "Closed",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      icon: <XCircle className="h-4 w-4 mr-2" />,
    },
    draft: {
      label: "Draft",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      icon: <Clock className="h-4 w-4 mr-2" />,
    },
  };

  const handleStatusChange = async (newStatus: JobStatus) => {
    if (newStatus === status) return;

    setLoading(true);
    try {
      await updateJobStatus(jobId, newStatus);
      setStatus(newStatus);

      if (onStatusChange) {
        onStatusChange(newStatus);
      }

      toast.success(`Job status updated to ${statusConfig[newStatus].label}`);
    } catch (error) {
      toast.error("Failed to update job status");
      console.error("Error updating job status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Status:</span>
        <Badge className={statusConfig[status].color}>
          <div className="flex items-center">
            {statusConfig[status].icon}
            {statusConfig[status].label}
          </div>
        </Badge>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled || loading}>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            disabled={disabled || loading}
          >
            {loading ? "Updating..." : "Change Status"}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {Object.entries(statusConfig).map(([key, config]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => handleStatusChange(key as JobStatus)}
              disabled={key === status}
              className={
                key === status ? "bg-accent text-accent-foreground" : ""
              }
            >
              <div className="flex items-center">
                {config.icon}
                {config.label}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default JobStatusToggle;
