import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Calendar, CheckCircle2, Clock, XCircle } from "lucide-react"
import type { Job } from "@/types/job"

interface JobStatsProps {
  jobs: Job[]
  applications: number
}

export function JobStats({ jobs = [], applications }: JobStatsProps) {
  // Calculate statistics from the jobs data
  const totalApplications = applications;

  const inProgressCount = jobs?.filter(job =>
    ["applied", "pending", "reviewing", "shortlisted", "interviewed"].includes(job.status ?? "")
  ).length || 0;
  
  const rejectedCount = jobs?.filter(job => job.status === "rejected").length || 0;

  // Count offers (status === "offered")
  const offersAndHiresCount = jobs?.filter(job =>
    ["shortlisted", "hired"].includes(job.status ?? "")
  ).length || 0;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-blue-500/10 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-white to-blue-500/5 dark:from-gray-800 dark:to-gray-900 dark:border-blue-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-blue-500 dark:text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500 dark:text-blue-500">{totalApplications}</div>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground">
            from last month
          </p>
        </CardContent>
      </Card>

      <Card className="border-blue-500/10 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-white to-blue-500/5 dark:from-gray-800 dark:to-gray-900 dark:border-blue-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">{inProgressCount}</div>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground">Applied to Interviewed</p>
        </CardContent>
      </Card>


      <Card className="border-green-500/10 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-white to-green-500/5 dark:from-gray-800 dark:to-gray-900 dark:border-green-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Offers & Hires</CardTitle>
          <div className="h-8 w-8 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500 dark:text-green-400">{offersAndHiresCount}</div>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground">Shortlisted to Hired</p>
        </CardContent>
      </Card>


      <Card className="border-red-500/10 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-white to-red-500/5 dark:from-gray-800 dark:to-gray-900 dark:border-red-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          <div className="h-8 w-8 rounded-full bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
            <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500 dark:text-red-400">{rejectedCount}</div>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground">Final decisions made</p>
        </CardContent>
      </Card>

    </div>
  )
}
