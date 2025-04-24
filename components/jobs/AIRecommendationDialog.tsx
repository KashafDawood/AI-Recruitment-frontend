import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateApplicationStatus } from "@/api/jobs/updateApplicationStatus";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ApplicationStatus } from "@/types/job";

interface AIRecommendation {
  rank: number;
  candidate_id: string;
  application_id: string;
  candidate_name: string;
  match_score: number;
  match_reasons: {
    category: string;
    strength: string;
    details: string;
  }[];
  gaps: {
    category: string;
    importance: string;
    details: string;
  }[];
}

interface AIRecommendationResponse {
  recommendations: AIRecommendation[];
  metadata: {
    total_candidates_evaluated: number;
    job_description_summary: string;
    processing_time_ms: number;
  };
}

interface AIRecommendationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isGenerating: boolean;
  recommendations: AIRecommendationResponse | null;
  onSelectApplicant: (applicationId: string) => void;
  jobId: number | string;
  applicants: { id: number; application_status: string }[];
}

const AIRecommendationDialog: React.FC<AIRecommendationDialogProps> = ({
  isOpen,
  onOpenChange,
  isGenerating,
  recommendations,
  onSelectApplicant,
  jobId,
  applicants,
}) => {
  const [updatingStatuses, setUpdatingStatuses] = useState<
    Record<string, boolean>
  >({});

  const getStrengthColor = (strength: string) => {
    switch (strength.toLowerCase()) {
      case "strong":
        return "text-green-600 dark:text-green-400";
      case "moderate":
        return "text-yellow-600 dark:text-yellow-400";
      case "weak":
        return "text-orange-600 dark:text-orange-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance.toLowerCase()) {
      case "high":
        return "text-red-600 dark:text-red-400";
      case "medium":
        return "text-orange-600 dark:text-orange-400";
      case "low":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusBadgeVariant = (status: string = "") => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "reviewing":
      case "reviewed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "shortlisted":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "interviewed":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      case "hired":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getApplicationStatus = (applicationId: string) => {
    const application = applicants.find(
      (app) => app.id.toString() === applicationId
    );
    return application?.application_status || "pending";
  };

  const handleStatusUpdate = async (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    setUpdatingStatuses((prev) => ({ ...prev, [applicationId]: true }));

    try {
      await updateApplicationStatus(jobId, [Number(applicationId)], newStatus);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update application status. Please try again."
      );
    } finally {
      setUpdatingStatuses((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            AI Candidate Recommendations
          </DialogTitle>
          <DialogDescription>
            {isGenerating
              ? "Our AI is analyzing all applicants to find the best matches for this position."
              : "Here are the top candidates for this position based on AI analysis."}
          </DialogDescription>
        </DialogHeader>

        {isGenerating ? (
          <div className="py-8 space-y-6">
            <div className="animate-pulse space-y-3">
              <p className="text-center text-muted-foreground">
                Analyzing candidate profiles and resumes...
              </p>
              <Progress value={45} className="h-2 w-full" />
              <p className="text-center text-xs text-muted-foreground">
                This might take a minute as we thoroughly analyze each
                applicant&apos;s qualifications.
              </p>
            </div>
          </div>
        ) : recommendations?.recommendations &&
          recommendations.recommendations.length > 0 ? (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium mb-1">Job Description Summary</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {recommendations.metadata.job_description_summary}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Evaluated {recommendations.metadata.total_candidates_evaluated}{" "}
                candidates
              </p>
            </div>

            <div className="space-y-4">
              {recommendations.recommendations.map((rec) => {
                const currentStatus = getApplicationStatus(rec.application_id);
                return (
                  <div
                    key={rec.application_id}
                    className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 h-8 w-8 rounded-full flex items-center justify-center font-bold text-blue-700 dark:text-blue-300">
                          {rec.rank}
                        </div>
                        <h3 className="font-medium">{rec.candidate_name}</h3>
                        <Badge
                          className={`${getStatusBadgeVariant(currentStatus)}`}
                          variant="outline"
                        >
                          {currentStatus.charAt(0).toUpperCase() +
                            currentStatus.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Match:</span>
                        <span
                          className={`text-sm font-bold ${
                            rec.match_score >= 85
                              ? "text-green-600 dark:text-green-400"
                              : rec.match_score >= 70
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-orange-600 dark:text-orange-400"
                          }`}
                        >
                          {rec.match_score}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Match Reasons
                        </h4>
                        <ul className="space-y-1.5">
                          {rec.match_reasons.map((reason, idx) => (
                            <li
                              key={idx}
                              className="text-sm flex items-start gap-2"
                            >
                              <span
                                className={`capitalize font-medium ${getStrengthColor(
                                  reason.strength
                                )}`}
                              >
                                {reason.category.replace("_", " ")}:
                              </span>
                              <span className="text-gray-700 dark:text-gray-300">
                                {reason.details}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {rec.gaps && rec.gaps.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Potential Gaps
                          </h4>
                          <ul className="space-y-1.5">
                            {rec.gaps.map((gap, idx) => (
                              <li
                                key={idx}
                                className="text-sm flex items-start gap-2"
                              >
                                <span
                                  className={`capitalize font-medium ${getImportanceColor(
                                    gap.importance
                                  )}`}
                                >
                                  {gap.category.replace("_", " ")}:
                                </span>
                                <span className="text-gray-700 dark:text-gray-300">
                                  {gap.details}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={updatingStatuses[rec.application_id]}
                            className="gap-1.5"
                          >
                            {updatingStatuses[rec.application_id] ? (
                              <>
                                <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-current"></span>
                                Updating...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4" />
                                Update Status
                              </>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {[
                            "pending",
                            "reviewing",
                            "shortlisted",
                            "interviewed",
                            "hired",
                            "rejected",
                          ].map((status) => (
                            <DropdownMenuItem
                              key={status}
                              disabled={
                                currentStatus === status ||
                                updatingStatuses[rec.application_id]
                              }
                              onClick={() =>
                                handleStatusUpdate(
                                  rec.application_id,
                                  status as ApplicationStatus
                                )
                              }
                              className="capitalize"
                            >
                              {status.replace("_", " ")}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button
                        size="sm"
                        onClick={() => onSelectApplicant(rec.application_id)}
                      >
                        View Applicant
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium">
              No Recommendations Available
            </h3>
            <p className="text-muted-foreground mt-2">
              {recommendations
                ? "No candidates matched the minimum criteria for this position."
                : "There was an error generating recommendations. Please try again."}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AIRecommendationDialog;
