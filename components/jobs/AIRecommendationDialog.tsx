import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ThumbsUp,
  AlertCircle,
  User2,
} from "lucide-react";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const getStrengthBgColor = (strength: string) => {
    switch (strength.toLowerCase()) {
      case "strong":
        return "bg-green-100 dark:bg-green-900/20";
      case "moderate":
        return "bg-yellow-100 dark:bg-yellow-900/20";
      case "weak":
        return "bg-orange-100 dark:bg-orange-900/20";
      default:
        return "bg-gray-100 dark:bg-gray-800/40";
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

  const getImportanceBgColor = (importance: string) => {
    switch (importance.toLowerCase()) {
      case "high":
        return "bg-red-100 dark:bg-red-900/20";
      case "medium":
        return "bg-orange-100 dark:bg-orange-900/20";
      case "low":
        return "bg-yellow-100 dark:bg-yellow-900/20";
      default:
        return "bg-gray-100 dark:bg-gray-800/40";
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 85)
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (score >= 70)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
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
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-blue-500" />
            AI Candidate Recommendations
          </DialogTitle>
          <DialogDescription className="text-base">
            {isGenerating
              ? "Our AI is analyzing all applicants to find the best matches for this position."
              : "Here are the top candidates for this position based on AI analysis."}
          </DialogDescription>
          <Separator />
        </DialogHeader>

        {isGenerating ? (
          <div className="py-10 space-y-8">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
                <div className="absolute inset-3 rounded-full border-t-2 border-blue-300 animate-spin animate-delay-150"></div>
                <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                AI Analysis in Progress
              </h3>
              <p className="text-center text-muted-foreground max-w-md">
                Evaluating candidate profiles and matching them with your job
                requirements
              </p>
            </div>
            <div className="space-y-3 max-w-lg mx-auto">
              <Progress value={45} className="h-2 w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Analyzing qualifications</span>
                <span>45%</span>
              </div>
            </div>
          </div>
        ) : recommendations?.recommendations &&
          recommendations.recommendations.length > 0 ? (
          <div className="space-y-6">
            <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                      Job Description Summary
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {recommendations.metadata.job_description_summary}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Badge
                        variant="outline"
                        className="bg-white/50 dark:bg-black/20"
                      >
                        {recommendations.metadata.total_candidates_evaluated}{" "}
                        candidates evaluated
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-white/50 dark:bg-black/20"
                      >
                        {(
                          recommendations.metadata.processing_time_ms / 1000
                        ).toFixed(1)}
                        s processing time
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-medium px-1">Top Candidates</h3>

              {recommendations.recommendations.map((rec) => {
                const currentStatus = getApplicationStatus(rec.application_id);
                return (
                  <Card
                    key={rec.application_id}
                    className="overflow-hidden transition-all duration-200 hover:shadow-md"
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center shadow-sm">
                              <User2 className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold border border-white dark:border-gray-800 text-blue-700 dark:text-blue-300">
                              {rec.rank}
                            </div>
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold">
                              {rec.candidate_name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                className={`${getStatusBadgeVariant(
                                  currentStatus
                                )} px-2 py-0.5`}
                              >
                                {currentStatus.charAt(0).toUpperCase() +
                                  currentStatus.slice(1)}
                              </Badge>
                              <Badge
                                className={`${getMatchScoreColor(
                                  rec.match_score
                                )} px-2 py-0.5`}
                              >
                                {rec.match_score}% Match
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="px-4 py-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <h4 className="text-sm font-medium">Strengths</h4>
                          </div>
                          <ul className="space-y-2">
                            {rec.match_reasons.map((reason, idx) => (
                              <li
                                key={idx}
                                className={`text-sm rounded-md p-2 ${getStrengthBgColor(
                                  reason.strength
                                )}`}
                              >
                                <div className="flex items-start gap-2">
                                  <div className="flex-shrink-0 mt-0.5">
                                    <Badge
                                      className={`${getStrengthColor(
                                        reason.strength
                                      )} bg-white dark:bg-black/20 text-xs capitalize`}
                                      variant="outline"
                                    >
                                      {reason.category.replace("_", " ")}
                                    </Badge>
                                  </div>
                                  <div className="text-gray-700 dark:text-gray-300 text-sm">
                                    {reason.details}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {rec.gaps && rec.gaps.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                              <h4 className="text-sm font-medium">
                                Potential Gaps
                              </h4>
                            </div>
                            <ul className="space-y-2">
                              {rec.gaps.map((gap, idx) => (
                                <li
                                  key={idx}
                                  className={`text-sm rounded-md p-2 ${getImportanceBgColor(
                                    gap.importance
                                  )}`}
                                >
                                  <div className="flex items-start gap-2">
                                    <div className="flex-shrink-0 mt-0.5">
                                      <Badge
                                        className={`${getImportanceColor(
                                          gap.importance
                                        )} bg-white dark:bg-black/20 text-xs capitalize`}
                                        variant="outline"
                                      >
                                        {gap.category.replace("_", " ")}
                                      </Badge>
                                    </div>
                                    <div className="text-gray-700 dark:text-gray-300 text-sm">
                                      {gap.details}
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="px-4 py-3 border-t dark:border-gray-800 flex flex-wrap justify-between items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={
                                    updatingStatuses[rec.application_id]
                                  }
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
                                      <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
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
                                    <Badge
                                      className={`${getStatusBadgeVariant(
                                        status
                                      )} mr-2 w-2 h-2 rounded-full p-0`}
                                    />
                                    {status.replace("_", " ")}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>Change candidate status</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <Button
                        size="sm"
                        onClick={() => onSelectApplicant(rec.application_id)}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                      >
                        View Full Profile
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-4 mb-4">
              <AlertTriangle className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              No Recommendations Available
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              {recommendations
                ? "No candidates matched the minimum criteria for this position."
                : "There was an error generating recommendations. Please try again."}
            </p>
            {!recommendations && (
              <Button variant="outline" className="mt-6">
                Retry Analysis
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AIRecommendationDialog;
