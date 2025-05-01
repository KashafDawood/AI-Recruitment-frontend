import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Briefcase,
  Building2,
  CalendarDays,
  MapPin,
  DollarSign,
  FileText,
  MessageSquare,
  Share2,
  Calendar,
} from "lucide-react"
import type { Job } from "@/types/job"
import { getStatusColor, getStatusText } from "./utils"

interface JobDetailProps {
  job: Job
}

export default function JobDetails({ job }: JobDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-blue-500/20 dark:border-blue-500/30 mb-4">
          <img
            src={job.logo || "/placeholder.svg"}
            alt={`${job.company} logo`}
            className="h-full w-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-blue-500 dark:text-blue-500">{job.title}</h2>
        <div className="flex items-center gap-1 text-muted-foreground dark:text-muted-foreground mt-1">
          <Building2 className="h-4 w-4" />
          <span>{job.company}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground dark:text-muted-foreground mt-1">
          <MapPin className="h-4 w-4" />
          <span>{job.location}</span>
        </div>

        <Badge className={`${getStatusColor(job.status)} mt-4 px-3 py-1 dark:bg-opacity-20 dark:text-opacity-90`}>
          {getStatusText(job.status)}
        </Badge>
      </div>

      <Separator className="dark:border-gray-700" />

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-500/5 dark:bg-blue-500/10 rounded-lg p-3 text-center">
          <div className="text-xs text-muted-foreground dark:text-muted-foreground mb-1">Job Type</div>
          <div className="font-medium text-blue-500 dark:text-blue-500 flex items-center justify-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            <span>{job.job_type}</span>
          </div>
        </div>
        <div className="bg-blue-500/5 dark:bg-blue-500/10 rounded-lg p-3 text-center">
          <div className="text-xs text-muted-foreground dark:text-muted-foreground mb-1">Salary</div>
          <div className="font-medium text-blue-500 dark:text-blue-500 flex items-center justify-center gap-1">
            <DollarSign className="h-3.5 w-3.5" />
            <span>{job.salary || "Not disclosed"}</span>
          </div>
        </div>
        <div className="bg-blue-500/5 dark:bg-blue-500/10 rounded-lg p-3 text-center">
          <div className="text-xs text-muted-foreground dark:text-muted-foreground mb-1">Applied On</div>
          <div className="font-medium text-blue-500 dark:text-blue-500 flex items-center justify-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{new Date(job.applied_date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-blue-500 dark:text-blue-500">Application Timeline</h3>
        <div className="space-y-3">
          {job.timeline?.map((event, index) => (
            <div key={index} className="flex gap-3">
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    index === 0 ? "bg-blue-500 dark:bg-blue-500" : "bg-blue-500/40 dark:bg-blue-500/60"
                  }`}
                />
                {index < (job.timeline?.length || 0) - 1 && (
                  <div className="w-0.5 h-full bg-blue-500/20 dark:bg-blue-500/30 absolute top-3" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm dark:text-gray-200">{event.title}</h4>
                  <span className="text-xs text-muted-foreground dark:text-muted-foreground">{event.date}</span>
                </div>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-blue-500 dark:text-blue-500">Job Description</h3>
        <p className="text-sm text-muted-foreground dark:text-muted-foreground">
          {job.description ||
            "Join our team as a talented professional and contribute to our growing company. This role offers competitive compensation and benefits in a collaborative environment."}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button className="flex-1 bg-blue-500 hover:bg-blue-500/90 dark:bg-blue-500 dark:hover:bg-blue-500/90 dark:text-white transition-colors">
          <Calendar className="mr-2 h-4 w-4" /> Schedule Interview
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-blue-500/20 text-blue-500 hover:bg-blue-500/5 dark:border-blue-500/30 dark:hover:bg-blue-500/10 dark:text-blue-500"
        >
          <FileText className="mr-2 h-4 w-4" /> View Resume
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-blue-500 hover:bg-blue-500/5 hover:text-blue-500 dark:hover:bg-blue-500/10 dark:text-blue-500"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-blue-500 hover:bg-blue-500/5 hover:text-blue-500 dark:hover:bg-blue-500/10 dark:text-blue-500"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
