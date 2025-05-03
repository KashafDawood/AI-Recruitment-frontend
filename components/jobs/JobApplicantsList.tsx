import React, { useState, useEffect } from "react";
import { getJobApplications } from "@/api/jobs/getJobApplications";
import {
  AIRecommendationResponse,
  getAIRecommendations,
} from "@/api/jobs/getAIRecommendations";
import { Application } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Mail, Sparkles } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import OptimizeImage from "../custom/optimizeImage";
import { toast } from "sonner";
import AIRecommendationDialog from "./AIRecommendationDialog";
import ApplicationStatusUpdate from "./ApplicationStatusUpdate";

interface JobApplicantsListProps {
  jobId: number | string;
  className?: string;
}

const JobApplicantsList: React.FC<JobApplicantsListProps> = ({
  jobId,
  className,
}) => {
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [aiRecommendations, setAiRecommendations] =
    useState<AIRecommendationResponse | null>(null);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] =
    useState(false);
  const [showRecommendationDialog, setShowRecommendationDialog] =
    useState(false);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setIsLoading(true);
        const data = await getJobApplications(jobId);
        console.log(data)
        setApplicants(data);
        setError(null);
        if (data.length > 0) {
          setSelectedApplication(data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch applicants:", err);
        setError("Failed to load applicants. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  const filteredApplications = applicants.filter((app) => {
    const candidateName = app.candidate_name || "";
    const candidateEmail = app.candidate_email || "";

    const matchesSearch =
      candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidateEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      app.application_status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const formatAppliedDate = (dateString: string) => {
    if (!dateString) return "date unknown";

    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "some time ago";
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

  const generateAIRecommendations = async () => {
    if (applicants.length === 0) {
      toast.error("There are no applicants to analyze.");
      return;
    }

    setIsGeneratingRecommendations(true);
    setShowRecommendationDialog(true);

    try {
      const recommendations = await getAIRecommendations(jobId, applicants);
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error("Failed to generate AI recommendations:", error);
      toast.error(
        (error instanceof Error ? error.message : String(error)) ||
          "An error occurred while generating AI recommendations."
      );
      setShowRecommendationDialog(false);
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  const selectRecommendedApplicant = (applicationId: string) => {
    const applicant = applicants.find(
      (app) => app.id.toString() === applicationId
    );
    if (applicant) {
      setSelectedApplication(applicant);
      setShowRecommendationDialog(false);
    }
  };

  const handleStatusUpdated = (updatedApplication: Application) => {
    // Update the applicants list with the updated application
    setApplicants(
      applicants.map((app) =>
        app.id === updatedApplication.id ? updatedApplication : app
      )
    );

    // Update the selected application
    setSelectedApplication(updatedApplication);
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-48 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ${className}`}
      >
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div
        className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center ${className}`}
      >
        <div className="mb-4">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">
          No applicants yet
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          There are no applications for this job posting yet.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      <div className="md:col-span-1">
        <div className="flex justify-between items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applicants..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-2 gap-1.5 gradient-button"
            onClick={generateAIRecommendations}
            disabled={isGeneratingRecommendations || applicants.length === 0}
          >
            {isGeneratingRecommendations ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                AI Recommend
              </>
            )}
          </Button>
        </div>

        <Tabs
          defaultValue="all"
          className="mb-4"
          onValueChange={setStatusFilter}
        >
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-1">
              Pending
            </TabsTrigger>
            <TabsTrigger value="reviewing" className="flex-1">
              Reviewing
            </TabsTrigger>
            <TabsTrigger value="interviewed" className="flex-1">
              Interviewed
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((application) => (
              <div
                key={application.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedApplication?.id === application.id
                    ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                    : "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
                }`}
                onClick={() => setSelectedApplication(application)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <OptimizeImage
                      src={application.candidate_photo || ""}
                      alt={application.candidate_name || "Applicant"}
                      width={150}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {application.candidate_name || "Anonymous Applicant"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {application.candidate_email || "No email provided"}
                    </p>
                  </div>
                  <Badge
                    className={`text-xs ${getStatusBadgeVariant(
                      application.application_status
                    )}`}
                    variant="outline"
                  >
                    {application.application_status
                      ? application.application_status.charAt(0).toUpperCase() +
                        application.application_status.slice(1)
                      : "Unknown"}
                  </Badge>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    Applied {formatAppliedDate(application.created_at)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No applicants found
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        {selectedApplication ? (
          <div className="border rounded-lg p-6 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-32 w-32 rounded-full overflow-hidden">
                <OptimizeImage
                  src={selectedApplication.candidate_photo || ""}
                  alt={selectedApplication.candidate_name || "Applicant"}
                  width={150}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedApplication.candidate_name || "Anonymous Applicant"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedApplication.candidate_email || "No email provided"}
                </p>
                <div className="flex items-center mt-1 gap-2">
                  <Badge
                    className={`${getStatusBadgeVariant(
                      selectedApplication.application_status
                    )}`}
                    variant="outline"
                  >
                    {selectedApplication.application_status
                      ? selectedApplication.application_status
                          .charAt(0)
                          .toUpperCase() +
                        selectedApplication.application_status.slice(1)
                      : "Unknown Status"}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    • Applied{" "}
                    {formatAppliedDate(selectedApplication.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant="outline"
                size="sm"
                className="text-sm"
                onClick={() =>
                  selectedApplication.resume &&
                  window.open(selectedApplication.resume, "_blank")
                }
                disabled={!selectedApplication.resume}
              >
                <FileText className="h-4 w-4 mr-1" />
                View Resume
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-sm"
                onClick={() =>
                  selectedApplication.candidate_email &&
                  (window.location.href = `mailto:${selectedApplication.candidate_email}`)
                }
                disabled={!selectedApplication.candidate_email}
              >
                <Mail className="h-4 w-4 mr-1" />
                Contact Candidate
              </Button>
            </div>

            <div className="space-y-6">
              {/* Use the new ApplicationStatusUpdate component */}
              <ApplicationStatusUpdate
                jobId={jobId}
                application={selectedApplication}
                onStatusUpdated={handleStatusUpdated}
              />
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-8 text-center h-full flex items-center justify-center dark:border-gray-700">
            <div className="text-muted-foreground">
              <p className="text-lg mb-2">
                Select an applicant to view details
              </p>
              <p>
                Click on any applicant from the list to view more information
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Use the new AIRecommendationDialog component */}
      <AIRecommendationDialog
        isOpen={showRecommendationDialog}
        onOpenChange={setShowRecommendationDialog}
        isGenerating={isGeneratingRecommendations}
        recommendations={aiRecommendations}
        onSelectApplicant={selectRecommendedApplicant}
        jobId={jobId}
        applicants={applicants}
      />
    </div>
  );
};

export default JobApplicantsList;
