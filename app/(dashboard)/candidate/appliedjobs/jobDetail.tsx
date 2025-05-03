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
import type { Job, JobStatus } from "@/types/job"
import { getStatusColor, getStatusText } from "./utils"
import { ApplicationTimeline }  from "./applicationTimeline"
import { useUserStore } from "@/store/userStore";
import OptimizeImage from "@/components/custom/optimizeImage";


interface JobDetailProps {
  job: Job
}

export default function JobDetails({ job }: JobDetailProps) {
  const user = useUserStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-blue-500/20 dark:border-blue-500/30 mb-4">
          <OptimizeImage
            src={job.candidate_photo || ""}
            alt={job.candidate_name || ""}
            width={200}
            height={200}
            className="object-cover"
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

        <Badge className={`${getStatusColor(job.status as JobStatus)} mt-4 px-3 py-1 rounded-md border`}>
          {getStatusText(job.status as JobStatus)}
        </Badge>

      </div>

      <Separator className="dark:border-gray-700" />

      {/* Application Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-primary/10 dark:border-primary/20">
        <ApplicationTimeline job={job} />
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
            <span>{job.applied_date ? new Date(job.applied_date).toLocaleDateString() : "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-blue-500 dark:text-blue-500">Job Description</h3>
        <p className="text-sm text-muted-foreground dark:text-muted-foreground">
          {job.description ||
            "Join our team as a talented professional and contribute to our growing company. This role offers competitive compensation and benefits in a collaborative environment."}
        </p>
      </div>

      {user?.role === "employer" && (
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
        </div>
      )}
    </div>
  )
}
