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
  Clock,
  Users,
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
import Link from "next/link";

interface AIRecommendation {
  rank: number;
  candidate_id: string;
  application_id: string;
  application_status: string;
  candidate_username: string;
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
          <div className="py-10 space-y-6">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
                <div className="absolute inset-3 rounded-full border-t-2 border-blue-300 animate-spin animate-delay-150"></div>
                <div className="absolute inset-6 rounded-full border-t-2 border-blue-200 animate-spin animate-delay-300"></div>
                <Sparkles className="absolute inset-0 m-auto h-9 w-9 text-blue-500" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-blue-800 dark:text-blue-300">
                AI Analysis in Progress
              </h3>
              <p className="text-center text-muted-foreground max-w-md mb-6">
                Evaluating candidate profiles and matching them with your job
                requirements
              </p>

              <div className="w-full max-w-md space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>Scanning resumes</span>
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      100%
                    </span>
                  </div>
                  <Progress
                    value={100}
                    className="h-1.5 w-full bg-blue-100 dark:bg-blue-900/30"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Estimating match scores</span>
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      24%
                    </span>
                  </div>
                  <Progress
                    value={24}
                    className="h-1.5 w-full bg-blue-100 dark:bg-blue-900/30"
                  />
                </div>
              </div>

              <div className="mt-8 text-sm text-center text-blue-600 dark:text-blue-400 animate-pulse">
                This may take a minute...
              </div>
            </div>
          </div>
        ) : recommendations?.recommendations &&
          recommendations.recommendations.length > 0 ? (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-50/30 dark:from-blue-900/20 dark:to-blue-950/10 border-blue-100 dark:border-blue-800/40 overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800/60 dark:to-blue-700/30 shadow-sm">
                    <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 text-lg mb-2">
                      Job Description Summary
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {recommendations.metadata.job_description_summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <Badge
                        variant="outline"
                        className="bg-white/80 dark:bg-black/30 border-blue-200 dark:border-blue-800/60 px-2.5 py-1 rounded-full flex items-center gap-1.5"
                      >
                        <Users className="h-3 w-3 text-blue-500" />
                        {
                          recommendations.metadata.total_candidates_evaluated
                        }{" "}
                        candidates evaluated
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-white/80 dark:bg-black/30 border-blue-200 dark:border-blue-800/60 px-2.5 py-1 rounded-full flex items-center gap-1.5"
                      >
                        <Clock className="h-3 w-3 text-blue-500" />
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

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium px-1 flex items-center gap-2">
                  <span>Top Candidates</span>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 ml-2">
                    {recommendations.recommendations.length}
                  </Badge>
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {recommendations.recommendations.map((rec) => {
                  const currentStatus = getApplicationStatus(
                    rec.application_id
                  );
                  return (
                    <Card
                      key={rec.application_id}
                      className="overflow-hidden border-gray-200 dark:border-gray-800 transition-all duration-200 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800/60"
                    >
                      <CardHeader className="p-5 pb-3 bg-gradient-to-r from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/30 flex items-center justify-center shadow-sm border border-blue-200 dark:border-blue-800/70">
                                <User2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-xs font-bold border-2 border-white dark:border-gray-800 text-white">
                                {rec.rank}
                              </div>
                            </div>
                            <div>
                              <CardTitle className="text-xl font-semibold">
                                {rec.candidate_name}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1.5">
                                <Badge
                                  className={`${getMatchScoreColor(
                                    rec.match_score
                                  )} px-2.5 py-0.5 rounded-full font-medium`}
                                >
                                  {rec.match_score}% Match
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="px-5 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                                <ThumbsUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                              <h4 className="text-sm font-medium text-green-800 dark:text-green-300">
                                Key Strengths
                              </h4>
                            </div>
                            <ul className="space-y-2.5">
                              {rec.match_reasons.map((reason, idx) => (
                                <li
                                  key={idx}
                                  className={`text-sm rounded-lg p-3 ${getStrengthBgColor(
                                    reason.strength
                                  )} border border-${
                                    reason.strength.toLowerCase() === "strong"
                                      ? "green"
                                      : reason.strength.toLowerCase() ===
                                        "moderate"
                                      ? "yellow"
                                      : "orange"
                                  }-200 dark:border-${
                                    reason.strength.toLowerCase() === "strong"
                                      ? "green"
                                      : reason.strength.toLowerCase() ===
                                        "moderate"
                                      ? "yellow"
                                      : "orange"
                                  }-800/30`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                      <Badge
                                        className={`${getStrengthColor(
                                          reason.strength
                                        )} bg-white dark:bg-black/30 text-xs capitalize px-2 py-0.5 shadow-sm`}
                                        variant="outline"
                                      >
                                        {reason.category.replace("_", " ")}
                                      </Badge>
                                    </div>
                                    <div className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
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
                                <div className="p-1 rounded-full bg-orange-100 dark:bg-orange-900/30">
                                  <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h4 className="text-sm font-medium text-orange-800 dark:text-orange-300">
                                  Potential Gaps
                                </h4>
                              </div>
                              <ul className="space-y-2.5">
                                {rec.gaps.map((gap, idx) => (
                                  <li
                                    key={idx}
                                    className={`text-sm rounded-lg p-3 ${getImportanceBgColor(
                                      gap.importance
                                    )} border border-${
                                      gap.importance.toLowerCase() === "high"
                                        ? "red"
                                        : gap.importance.toLowerCase() ===
                                          "medium"
                                        ? "orange"
                                        : "yellow"
                                    }-200 dark:border-${
                                      gap.importance.toLowerCase() === "high"
                                        ? "red"
                                        : gap.importance.toLowerCase() ===
                                          "medium"
                                        ? "orange"
                                        : "yellow"
                                    }-800/30`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="flex-shrink-0 mt-0.5">
                                        <Badge
                                          className={`${getImportanceColor(
                                            gap.importance
                                          )} bg-white dark:bg-black/30 text-xs capitalize px-2 py-0.5 shadow-sm`}
                                          variant="outline"
                                        >
                                          {gap.category.replace("_", " ")}
                                        </Badge>
                                      </div>
                                      <div className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
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

                      <CardFooter className="px-5 py-4 border-t dark:border-gray-800 flex flex-wrap justify-between items-center gap-3 bg-gray-50 dark:bg-gray-900/50">
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
                                    className="gap-1.5 border-gray-300 dark:border-gray-700"
                                  >
                                    {updatingStatuses[rec.application_id] ? (
                                      <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-current"></span>
                                        Updating...
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                        Update Status
                                        <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
                                      </>
                                    )}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="start"
                                  className="border-gray-200 dark:border-gray-700 shadow-lg"
                                >
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
                                        )} mr-2.5 w-2.5 h-2.5 rounded-full p-0`}
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

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/${rec.candidate_username}`}
                            target="_blank"
                          >
                            <Button
                              size="sm"
                              onClick={() =>
                                onSelectApplicant(rec.candidate_username)
                              }
                              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white shadow-sm"
                            >
                              View Full Profile
                            </Button>
                          </Link>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/20 p-5 mb-5 shadow-sm">
              <AlertTriangle className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-2xl font-medium mb-3 text-yellow-800 dark:text-yellow-300">
              No Recommendations Available
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {recommendations
                ? "No candidates matched the minimum criteria for this position. Consider adjusting your job requirements or waiting for more applications."
                : "There was an error generating recommendations. Our AI system might need a moment to process the data."}
            </p>
            {!recommendations && (
              <Button
                variant="outline"
                className="mt-2 border-yellow-300 dark:border-yellow-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-200"
              >
                <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                Retry Analysis
              </Button>
            )}

            {recommendations && (
              <div className="mt-6 max-w-md">
                <Card className="bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-800/30">
                  <CardContent className="p-4 text-left">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                      Suggestions:
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-1 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-yellow-700 dark:text-yellow-400" />
                        </div>
                        <span>
                          Broaden skill requirements to attract more candidates
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-1 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-yellow-700 dark:text-yellow-400" />
                        </div>
                        <span>Share the job posting on more platforms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-1 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-yellow-700 dark:text-yellow-400" />
                        </div>
                        <span>Check back later as new applications arrive</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AIRecommendationDialog;
