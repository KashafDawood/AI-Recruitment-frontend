"use client";

import { useEffect, useState } from "react";
import { useUserWithLoading } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { getAppliedJobs } from "@/api/candidate/getAppliedJobs";
import { getSavedJobs } from "@/api/candidate/getSavedJobs";
import ProfileCompletionAlert from "@/components/custom/ProfileCompletionAlert";
import { Job } from "@/types/job";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  BookmarkCheck,
  CheckCircle,
  Clock,
  User,
  FileText,
  Plus,
  ChevronRight,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import Spinner from "@/components/ui/spinner";
import JobCard from "@/components/custom/JobCard";

// StatCard component for showing key metrics
interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  className?: string;
  iconColor?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  className = "",
  iconColor = "text-blue-500 dark:text-blue-400",
}: StatCardProps) => {
  return (
    <Card className={`border-0 shadow-sm ${className}`}>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 h-fit">
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading } = useUserWithLoading();
  const [recentApplications, setRecentApplications] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    applied: 0,
    saved: 0,
    inProgress: 0,
    rejected: 0,
    shortlisted: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Fetch recent applications (limited to 3)
        const appliedJobsData = await getAppliedJobs(1, 3);
        const savedJobsData = await getSavedJobs(1, 3);

        setRecentApplications(appliedJobsData.results || []);
        setSavedJobs(savedJobsData.results || []);

        // Calculate statistics
        setStats({
          applied: appliedJobsData.count || 0,
          saved: savedJobsData.count || 0,
          inProgress: (appliedJobsData.results || []).filter((job) =>
            ["applied", "pending", "reviewing", "interviewed"].includes(
              job.status || ""
            )
          ).length,
          rejected: (appliedJobsData.results || []).filter(
            (job) => job.status === "rejected"
          ).length,
          shortlisted: (appliedJobsData.results || []).filter((job) =>
            ["shortlisted", "hired"].includes(job.status || "")
          ).length,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleJobClick = (job: Job) => {
    router.push(`/candidate/appliedjobs?job=${job.id}`);
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  // Calculate profile completion percentage
  const profileSections = [
    user?.name,
    user?.bio,
    user?.education &&
      Array.isArray(user.education) &&
      user.education.length > 0,
    user?.skills && Array.isArray(user.skills) && user.skills.length > 0,
    user?.experience,
    user?.certifications &&
      Array.isArray(user.certifications) &&
      user.certifications.length > 0,
  ];

  const completedSections = profileSections.filter(Boolean).length;
  const profileCompletionPercentage = Math.round(
    (completedSections / profileSections.length) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile alert for incomplete profiles */}
        {profileCompletionPercentage < 100 && (
          <ProfileCompletionAlert user={user} className="mb-6" />
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              Welcome back, {user?.name || "Candidate"}
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
            onClick={() => router.push("/candidate/jobs")}
          >
            <Briefcase className="h-4 w-4" />
            Find New Jobs
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Applied Jobs"
            value={stats.applied}
            description="Total applications"
            icon={CheckCircle}
          />
          <StatCard
            title="Saved Jobs"
            value={stats.saved}
            description="Bookmarked positions"
            icon={BookmarkCheck}
            iconColor="text-green-500 dark:text-green-400"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            description="Applications being reviewed"
            icon={Clock}
            iconColor="text-amber-500 dark:text-amber-400"
          />
          <StatCard
            title="Shortlisted"
            value={stats.shortlisted}
            description="Applications with positive outcomes"
            icon={Calendar}
            iconColor="text-purple-500 dark:text-purple-400"
          />
        </div>

        {/* Recent Applications and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                    Recent Applications
                  </CardTitle>
                  <Link href="/candidate/appliedjobs">
                    <Button
                      variant="ghost"
                      className="text-blue-600 dark:text-blue-400 p-0 h-auto"
                    >
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>
                  Your most recent job applications
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {recentApplications.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {recentApplications.map((job, index) => (
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
                      No applications yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mb-4">
                      You haven&apos;t applied for any jobs yet. Start exploring
                      opportunities and submit your first application.
                    </p>
                    <Button
                      className="flex items-center gap-2"
                      onClick={() => router.push("/candidate/jobs")}
                    >
                      <Plus className="h-4 w-4" />
                      Find Jobs
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
                  Commonly used features and tools
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => router.push("/candidate/jobs")}
                  >
                    <Briefcase className="h-4 w-4 mr-3 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="font-medium">Find New Jobs</div>
                      <div className="text-xs text-muted-foreground">
                        Browse the latest job opportunities
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => router.push("/candidate/savedjobs")}
                  >
                    <BookmarkCheck className="h-4 w-4 mr-3 text-green-600 dark:text-green-400" />
                    <div>
                      <div className="font-medium">Saved Jobs</div>
                      <div className="text-xs text-muted-foreground">
                        View your bookmarked positions
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => router.push("/candidate/profile")}
                  >
                    <User className="h-4 w-4 mr-3 text-purple-600 dark:text-purple-400" />
                    <div>
                      <div className="font-medium">Update Profile</div>
                      <div className="text-xs text-muted-foreground">
                        Enhance your candidate profile
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => router.push("/candidate/appliedjobs")}
                  >
                    <FileText className="h-4 w-4 mr-3 text-amber-600 dark:text-amber-400" />
                    <div>
                      <div className="font-medium">Application Status</div>
                      <div className="text-xs text-muted-foreground">
                        Track your job applications
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile Completion */}
        <Card className="border-0 shadow-md mb-8">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 border-b dark:border-gray-700">
            <CardTitle className="text-xl font-semibold text-green-700 dark:text-green-400">
              Profile Completion
            </CardTitle>
            <CardDescription>
              A complete profile increases your chances of getting hired
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Profile Status</span>
                <span className="text-sm font-medium">
                  {profileCompletionPercentage}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${profileCompletionPercentage}%` }}
                ></div>
              </div>
            </div>

            {profileCompletionPercentage < 100 && (
              <Button
                className="w-full mt-2"
                onClick={() => router.push("/candidate/profile")}
              >
                Complete Your Profile
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Saved Jobs Section */}
        <Card className="border-0 shadow-md">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-b dark:border-gray-700">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold text-amber-700 dark:text-amber-400">
                Saved Jobs
              </CardTitle>
              <Link href="/candidate/savedjobs">
                <Button
                  variant="ghost"
                  className="text-amber-600 dark:text-amber-400 p-0 h-auto"
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <CardDescription>
              Jobs you&apos;ve bookmarked for later
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {savedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedJobs.map((job, index) => (
                  <div
                    key={job.id || index}
                    className="cursor-pointer transition-transform hover:scale-[1.01]"
                    onClick={() => router.push(`/candidate/jobs?job=${job.id}`)}
                  >
                    <JobCard
                      job={job}
                      index={index}
                      isSelected={false}
                      showSaveJob={true}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 bg-gray-50 dark:bg-gray-800/40 rounded-lg text-center">
                <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-3 mb-4">
                  <BookmarkCheck className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No saved jobs</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mb-4">
                  You haven&apos;t saved any jobs yet. Save jobs to apply to
                  them later.
                </p>
                <Button
                  className="flex items-center gap-2"
                  onClick={() => router.push("/candidate/jobs")}
                >
                  <Plus className="h-4 w-4" />
                  Browse Jobs
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
