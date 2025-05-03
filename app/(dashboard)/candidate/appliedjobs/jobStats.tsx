import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Calendar, CheckCircle2, Clock } from "lucide-react"
import type { Job } from "./types"

interface JobStatsProps {
  jobs: Job[]
  applications: number
}

export function JobStats({ jobs = [], applications }: JobStatsProps) {
  // Calculate statistics from the jobs data
  const totalApplications = applications;

  // Count interviews (status === "interviewing")
  const activeInterviews = jobs?.filter((job) => job.status === "interviewing").length || 0;

  // Count offers (status === "offered")
  const offersReceived = jobs?.filter((job) => job.status === "offered").length || 0;

  // Calculate average response time (in days) - this is a placeholder calculation
  const calculateAvgResponseTime = () => {
    const responseTimes = jobs
      ?.map((job) => {
        if (job.timeline && job.timeline.length > 1) {
          const applicationDate = new Date(job.appliedDate);
          const responseDate = new Date(job.timeline[1].date);
          return Math.floor((responseDate.getTime() - applicationDate.getTime()) / (1000 * 60 * 60 * 24));
        }
        return null;
      })
      .filter((time) => time !== null);

    if (responseTimes.length === 0) return "N/A";

    const avgDays = responseTimes.reduce((sum, time) => sum + (time || 0), 0) / responseTimes.length;
    return `${avgDays.toFixed(1)} days`;
  };

  const applicationChange = "+4";
  const interviewsScheduled = activeInterviews > 0 ? `${activeInterviews} scheduled` : "None scheduled";
  const pendingOffers = jobs?.filter(
    (job) =>
      job.status === "offered" &&
      job.timeline?.some(
        (event) => event.title.toLowerCase().includes("offer") && !event.title.toLowerCase().includes("accepted")
      )
  ).length || 0;

  const avgResponseTime = calculateAvgResponseTime();
  const responseTimeChange = avgResponseTime !== "N/A" ? "-1.3 days" : "N/A";

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
            {applicationChange} from last month
          </p>
        </CardContent>
      </Card>

      <Card className="border-blue-500/10 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-white to-blue-500/5 dark:from-gray-800 dark:to-gray-900 dark:border-blue-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Interviews</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">{activeInterviews}</div>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground">{interviewsScheduled}</p>
        </CardContent>
      </Card>

      <Card className="border-green-500/10 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-white to-green-500/5 dark:from-gray-800 dark:to-gray-900 dark:border-green-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Offers Received</CardTitle>
          <div className="h-8 w-8 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500 dark:text-green-400">{offersReceived}</div>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground">{pendingOffers} pending decision</p>
        </CardContent>
      </Card>

      <Card className="border-amber-500/10 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-white to-amber-500/5 dark:from-gray-800 dark:to-gray-900 dark:border-amber-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          <div className="h-8 w-8 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center">
            <Clock className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-500 dark:text-amber-400">{avgResponseTime}</div>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground">{responseTimeChange} from previous</p>
        </CardContent>
      </Card>
    </div>
  )
}
