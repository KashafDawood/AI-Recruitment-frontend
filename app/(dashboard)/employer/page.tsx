"use client";

import { useEffect, useState } from "react";
import { useUserWithLoading } from "@/hooks/useUser";
import { getAllEmployerJobs } from "@/api/jobs/getAllEmployerjobs";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/job";
import Spinner from "@/components/ui/spinner";
import JobCard from "@/components/custom/JobCard";
import {
  Briefcase,
  Clock,
  FileText,
  LucideIcon,
  Plus,
  Users,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className,
}: StatCardProps) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
            {trend && trendValue && (
              <div className="flex items-center mt-2">
                <span
                  className={`text-xs font-medium ${
                    trend === "up"
                      ? "text-green-600"
                      : trend === "down"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 h-fit">
            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading } = useUserWithLoading();
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [jobStats, setJobStats] = useState({
    open: 0,
    draft: 0,
    closed: 0,
    totalApplicants: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobData = async () => {
      if (!user?.username) return;

      setLoading(true);
      try {
        // Fetch recent jobs (open jobs, limited to 3)
        const openJobs = await getAllEmployerJobs(1, 3, user.username, {
          job_status: "open",
        });

        // Get counts for each status
        const [openJobsData, draftJobsData, closedJobsData] = await Promise.all(
          [
            getAllEmployerJobs(1, 1, user.username, { job_status: "open" }),
            getAllEmployerJobs(1, 1, user.username, { job_status: "draft" }),
            getAllEmployerJobs(1, 1, user.username, { job_status: "closed" }),
          ]
        );

        setRecentJobs(openJobs.results || []);
        setJobStats({
          open: openJobsData.count || 0,
          draft: draftJobsData.count || 0,
          closed: closedJobsData.count || 0,
          totalApplicants: calculateTotalApplicants(openJobs.results || []),
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchJobData();
    }
  }, [user]);

  const calculateTotalApplicants = (jobs: Job[]) => {
    return jobs.reduce((total, job) => {
      return total + parseInt(job.applicants?.toString() || "0");
    }, 0);
  };

  const handleJobClick = (job: Job) => {
    router.push(`/employer/my-joblistings/job-detail?id=${job.id}`);
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              Welcome back, {user?.name || "Employer"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => router.push("/employer/create-job")}
          >
            <Plus className="h-4 w-4" />
            Post a New Job
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Job Listings"
            value={jobStats.open}
            description="Currently open positions"
            icon={Briefcase}
            trend="neutral"
            trendValue=""
          />
          <StatCard
            title="Draft Listings"
            value={jobStats.draft}
            description="Jobs in progress"
            icon={FileText}
            trend="neutral"
            trendValue=""
          />
          <StatCard
            title="Total Applicants"
            value={jobStats.totalApplicants}
            description="Across all active jobs"
            icon={Users}
            trend="neutral"
            trendValue=""
          />
          <StatCard
            title="Closed Positions"
            value={jobStats.closed}
            description="Historical positions"
            icon={Clock}
            trend="neutral"
            trendValue=""
          />
        </div>

        {/* Recent Jobs and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Jobs */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                    Recent Job Listings
                  </CardTitle>
                  <Link href="/employer/my-joblistings">
                    <Button
                      variant="ghost"
                      className="text-blue-600 dark:text-blue-400 p-0 h-auto"
                    >
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>
                  Your most recently posted active job listings
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {recentJobs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {recentJobs.map((job, index) => (
                      <div
                        key={job.id || index}
                        className="cursor-pointer transition-transform hover:scale-[1.01]"
                        onClick={() => handleJobClick(job)}
                      >
                        <JobCard job={job} index={index} isSelected={false} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 bg-gray-50 dark:bg-gray-800/40 rounded-lg text-center">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mb-4">
                      <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      No active job listings
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mb-4">
                      You don&apos;t have any active job listings yet. Create
                      your first job posting to start receiving applications.
                    </p>
                    <Button
                      className="flex items-center gap-2"
                      onClick={() => router.push("/employer/create-job")}
                    >
                      <Plus className="h-4 w-4" />
                      Post a New Job
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="border-0 shadow-md h-full">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b dark:border-gray-700">
                <CardTitle className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common tasks for managing your recruiting
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => router.push("/employer/create-job")}
                  >
                    <Plus className="h-4 w-4 mr-3 text-green-600 dark:text-green-400" />
                    <div>
                      <div className="font-medium">Post a New Job</div>
                      <div className="text-xs text-muted-foreground">
                        Create a new job listing for your company
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => router.push("/employer/my-joblistings")}
                  >
                    <Briefcase className="h-4 w-4 mr-3 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="font-medium">Manage Job Listings</div>
                      <div className="text-xs text-muted-foreground">
                        View and edit your current job postings
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => router.push("/employer/profile")}
                  >
                    <Users className="h-4 w-4 mr-3 text-purple-600 dark:text-purple-400" />
                    <div>
                      <div className="font-medium">Company Profile</div>
                      <div className="text-xs text-muted-foreground">
                        Update your company information
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
