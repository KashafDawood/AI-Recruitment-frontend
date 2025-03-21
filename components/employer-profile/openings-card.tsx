import { User } from "@/store/userStore";
import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAllEmployerJobs } from "@/api/jobs/getAllEmployerjobs";
import { Job } from "@/types/job";
import JobCard from "../custom/JobCard";
import { toast } from "sonner";

export const OpeningsCard: React.FC<{ user: User | null }> = ({ user }) => {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      if (user?.username) {
        setLoading(true);
        try {
          const res = await getAllEmployerJobs(user.username);
          setJobs(res);
        } catch {
          toast.error("Failed to fetch job openings. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchJobs();
  }, [user]);

  return (
    <Card className="dark:bg-gray-900">
      <CardHeader>
        <h2 className="text-xl font-semibold">Current Openings</h2>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center p-4">Loading jobs...</div>
        ) : jobs && Array.isArray(jobs) && jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <JobCard job={job} index={index} key={index} isSelected={false} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-muted p-8 text-center bg-gray-200 dark:bg-gray-800">
            <h3 className="text-lg font-bold mb-2">No open positions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              There are currently no job openings at {user?.company_name}.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
