import { User } from "@/store/userStore";
import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAllEmployerJobs } from "@/api/jobs/getAllEmployerjobs";

interface Job {
  title?: string;
  description?: string;
  [key: string]: any;
}

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
          console.log("Jobs fetched:", res);
        } catch (error) {
          console.error("Error fetching jobs:", error);
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
              <div
                key={index}
                className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                <h3 className="font-medium">
                  {job.title || "Untitled Position"}
                </h3>
                {job.description && (
                  <p className="text-sm mt-2">{job.description}</p>
                )}
              </div>
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
