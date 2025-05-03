import { CheckCircle, Circle, Clock, X } from "lucide-react"
import type { Job } from "@/types/job"
import { cn } from "@/lib/utils"

// Define the application status choices and their order
export const APPLICATION_STATUS_CHOICES = [
  { value: "applied", label: "Applied" },
  { value: "pending", label: "Pending" },
  { value: "reviewing", label: "Reviewing" },
  { value: "shortlisted", label: "ShortListed" },
  { value: "interviewed", label: "Interviewed" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
]

interface ApplicationTimelineProps {
  job: Job
  className?: string
}

// Updated the application timeline to include the new statuses
export function ApplicationTimeline({ job, className = "" }: ApplicationTimelineProps) {
  // Determine which stages should be active based on the job status
  const getStageStatus = (stageValue: string) => {
    const statusIndex = APPLICATION_STATUS_CHOICES.findIndex((status) => status.value === job.status)
    const stageIndex = APPLICATION_STATUS_CHOICES.findIndex((status) => status.value === stageValue)

    // Special case for rejected - it can happen at any stage
    if (job.status === "rejected") {
      if (stageValue === "rejected") return "active"
      return stageIndex < APPLICATION_STATUS_CHOICES.findIndex((s) => s.value === "rejected") ? "completed" : "inactive"
    }

    // For normal progression
    if (stageIndex < statusIndex) return "completed" // Past stages
    if (stageIndex === statusIndex) return "active" // Current stage
    return "inactive" // Future stages
  }

  // Get the appropriate icon for a stage
  const getStageIcon = (stageValue: string) => {
    const status = getStageStatus(stageValue)

    if (status === "active" || status === "completed") {
      if (stageValue === "rejected") {
        return <X className="h-4 w-4" />
      } else if (stageValue === "interviewed" && status === "active") {
        return <Clock className="h-4 w-4" />
      } else {
        return <CheckCircle className="h-4 w-4" />
      }
    } else {
      return <Circle className="h-4 w-4" />
    }
  }

  // Get the appropriate status message based on job status
  const getStatusMessage = () => {
    switch (job.status) {
      case "applied":
        return "Your application was received and is under review."
      case "interviewing":
        return "You've been selected for an interview. Our team will be in touch with further details."
      case "offered":
        return "Congratulations! An offer has been extended to you. Please review and respond."
      case "rejected":
        return "Thank you for your interest. We've decided to proceed with other candidates at this time."
      default:
        return "Your application is being processed."
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-semibold text-lg text-blue-500 dark:text-blue-500">Application Progress</h3>

      <div className="space-y-3">
        {APPLICATION_STATUS_CHOICES.map((stage, index) => {
          const status = getStageStatus(stage.value)
          const isActive = status === "active" || status === "completed"

          return (
            <div key={stage.value} className="flex gap-3">
              <div className="relative flex flex-col items-center">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    isActive
                      ? stage.value === "rejected"
                        ? "bg-red-500 dark:bg-red-600"
                        : "bg-blue-500 dark:bg-blue-500"
                      : "bg-gray-200 dark:bg-gray-700",
                  )}
                />
                {index < APPLICATION_STATUS_CHOICES.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 h-full absolute top-3",
                      getStageStatus(APPLICATION_STATUS_CHOICES[index + 1].value) !== "inactive"
                        ? "bg-blue-500/20 dark:bg-blue-500/30"
                        : "bg-gray-200 dark:bg-gray-700",
                    )}
                  />
                )}
              </div>

              <div className="flex-1 pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "p-1 rounded-full",
                        isActive
                          ? stage.value === "rejected"
                            ? "text-red-500 dark:text-red-400"
                            : "text-blue-500 dark:text-blue-500"
                          : "text-gray-400 dark:text-gray-500",
                      )}
                    >
                      {getStageIcon(stage.value)}
                    </div>
                    <h4
                      className={cn(
                        "font-medium text-sm",
                        isActive
                          ? stage.value === "rejected"
                            ? "text-red-600 dark:text-red-400"
                            : "text-blue-500 dark:text-blue-500"
                          : "text-gray-500 dark:text-gray-400",
                      )}
                    >
                      {stage.label}
                    </h4>
                  </div>

                  {status === "active" && (
                    <span className="text-xs text-muted-foreground dark:text-muted-foreground">
                      {stage.value === "applied" ? new Date(job.applied_date ?? "").toLocaleDateString() : "In progress"}
                    </span>
                  )}
                </div>

                {status === "active" && (
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1 ml-6">
                    {stage.value === "applied"
                      ? "Your application was received and is under review."
                      : stage.value === "pending"
                        ? "Your application is pending review."
                        : stage.value === "reviewing"
                          ? "Your application is being reviewed by our team."
                          : stage.value === "shortlisted"
                            ? "Congratulations! You have been shortlisted for the next stage."
                            : stage.value === "interviewed"
                              ? "You've completed the interview. We will update you with the results soon."
                              : stage.value === "hired"
                                ? "Congratulations! You have been hired. Welcome to the team!"
                                : stage.value === "rejected"
                                  ? "Thank you for your interest. We've decided to proceed with other candidates at this time."
                                  : "Your application is being processed."}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
