import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Application, ApplicationStatus } from "@/types/job";
import { updateApplicationStatus } from "@/api/jobs/updateApplicationStatus";
import { FileText } from "lucide-react";
import ContractGenerationDialog from "./ContractGenerationDialog";
import { ContractGenerationResponse } from "@/api/jobs/generateContract";
import { toast } from "sonner";

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
  const [showContractDialog, setShowContractDialog] = useState(false);

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

  const handleContractGenerated = (
    contractData: ContractGenerationResponse
  ) => {
    // Open the contract in a new tab
    if (contractData.contract_url) {
      window.open(contractData.contract_url, "_blank");
    }

    // Show a success message with the candidate name
    toast.success(
      `Contract for ${contractData.candidate_name} has been generated and sent`
    );

    // Update the application with the contract URL if not already in the object
    if (!application.contract) {
      const updatedApplication = {
        ...application,
        contract: contractData.contract_url,
      };
      onStatusUpdated(updatedApplication);
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

      {/* Show contract generation button when status is hired */}
      {application.application_status === "hired" && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Employment Contract</h3>
          <div className="flex flex-wrap gap-2">
            {application.contract ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => window.open(application.contract, "_blank")}
              >
                <FileText className="h-4 w-4" />
                View Contract
              </Button>
            ) : null}

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 gradient-button"
              onClick={() => setShowContractDialog(true)}
            >
              <FileText className="h-4 w-4" />
              {application.contract
                ? "Generate New Contract"
                : "Generate Contract"}
            </Button>
          </div>
        </div>
      )}

      {/* Contract generation dialog */}
      <ContractGenerationDialog
        isOpen={showContractDialog}
        onOpenChange={setShowContractDialog}
        application={application}
        jobId={jobId}
        onContractGenerated={handleContractGenerated}
      />
    </div>
  );
};

export default ApplicationStatusUpdate;
