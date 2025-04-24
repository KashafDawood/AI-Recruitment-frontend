import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Application, ApplicationStatus } from "@/types/job";
import { updateApplicationStatus } from "@/api/jobs/updateApplicationStatus";

interface ApplicationStatusUpdateProps {
  jobId: number | string;
  application: Application;
  onStatusUpdated: (updatedApplication: Application) => void;
}

const ApplicationStatusUpdate: React.FC<ApplicationStatusUpdateProps> = ({
  jobId,
  application,
  onStatusUpdated,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusUpdate = async (newStatus: ApplicationStatus) => {
    if (!application || isUpdating) return;

    setIsUpdating(true);
    setError(null);

    try {
      await updateApplicationStatus(jobId, [application.id], newStatus);

      // Update the application with the new status
      const updatedApplication = {
        ...application,
        application_status: newStatus as Application["application_status"],
      };

      // Notify parent component of the update
      onStatusUpdated(updatedApplication);
    } catch (error) {
      console.error("Failed to update status:", error);
      setError("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const statuses: ApplicationStatus[] = [
    "pending",
    "reviewing",
    "shortlisted",
    "interviewed",
    "hired",
    "rejected",
  ];

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Update Status</h3>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Button
            key={status}
            variant={
              application.application_status === status ? "default" : "outline"
            }
            size="sm"
            className="capitalize"
            onClick={() => handleStatusUpdate(status)}
            disabled={isUpdating || application.application_status === status}
          >
            {status.replace("_", " ")}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ApplicationStatusUpdate;
