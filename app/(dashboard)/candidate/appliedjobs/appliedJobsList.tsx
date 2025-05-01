"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CalendarDays, Briefcase, Building2, MapPin, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { JobStatus } from "@/types/job"
import { mockJobs } from "./data"

const getStatusColor = (status: JobStatus) => {
  switch (status) {
    case "applied":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "interviewing":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200"
    case "offered":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusText = (status: JobStatus) => {
  switch (status) {
    case "applied":
      return "Applied"
    case "interviewing":
      return "Interviewing"
    case "rejected":
      return "Rejected"
    case "offered":
      return "Offered"
    default:
      return status
  }
}

interface AppliedJobsListProps {
  filter?: JobStatus
  onSelectJob: (id: string) => void
  selectedJobId: string
}

export function AppliedJobsList({ filter, onSelectJob, selectedJobId }: AppliedJobsListProps) {
  const filteredJobs = filter ? mockJobs.filter((job) => job.status === filter) : mockJobs

  return (
    <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No job applications found with this status.</p>
        </div>
      ) : (
        filteredJobs.map((job) => (
          <Card
            key={job.id}
            className={cn(
              "overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md border-l-4",
              selectedJobId === job.id
                ? "border-l-primary shadow-md"
                : job.status === "applied"
                  ? "border-l-blue-500 hover:border-l-primary"
                  : job.status === "interviewing"
                    ? "border-l-amber-500 hover:border-l-primary"
                    : job.status === "offered"
                      ? "border-l-green-500 hover:border-l-primary"
                      : "border-l-red-500 hover:border-l-primary",
            )}
            onClick={() => onSelectJob(job.id)}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary/20 flex-shrink-0">
                  <img
                    src={job.logo || "/placeholder.svg"}
                    alt={`${job.company} logo`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="font-semibold text-primary truncate">{job.title}</h3>
                    <Badge className={`${getStatusColor(job.status)} self-start sm:self-center whitespace-nowrap`}>
                      {getStatusText(job.status)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Building2 className="h-3.5 w-3.5" />
                    <span className="truncate">{job.company}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Briefcase className="h-3 w-3" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      <span>Applied {new Date(job.appliedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{job.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
