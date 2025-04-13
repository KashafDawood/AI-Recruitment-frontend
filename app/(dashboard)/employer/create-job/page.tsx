"use client";

import { Button } from "@/components/ui/button";
import CreateJobForm from "./createJobForm";
import { createJob } from "@/api/jobs/createJob";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import JobDetails from "@/components/jobs/jobDetails";
import { Job } from "@/types/job";

const CreateJob: React.FC = () => {
  const [state, formAction] = useActionState(createJob, undefined);
  const router = useRouter();
  const [previewJob, setPreviewJob] = useState<Job | null>(null);

  useEffect(() => {
    if (state?.message) {
      toast.success(state.message);

      // If job was successfully created and approved without policy violations
      if (state.job && state.approved) {
        // Navigate to job dashboard or job detail page after short delay
        setTimeout(() => {
          router.push("/employer/jobs");
        }, 1500);
      }
    }

    if (state?.serverError) {
      toast.error(state.serverError);
    }
  }, [state, router]);

  const handleAIGeneration = () => {
    // Generate a sample job preview
    const sampleJob: Job = {
      id: 999,
      title: "AI Generated Job Title",
      company: "Your Company",
      location: "Remote/Onsite",
      job_type: "Full-time",
      job_status: "Active",
      experience_required: "3-5 years",
      salary: "$80,000 - $120,000",
      description:
        "This is an AI-generated job description that showcases what your job posting could look like. You can edit all sections in the form.",
      required_qualifications: [
        "Bachelor's degree in relevant field",
        "Experience with modern technologies",
        "Strong communication skills",
      ],
      preferred_qualifications: [
        "Master's degree",
        "Industry certifications",
        "Team leadership experience",
      ],
      responsibilities: [
        "Design and develop scalable solutions",
        "Collaborate with cross-functional teams",
        "Troubleshoot and debug issues",
      ],
      benefits: [
        "Competitive salary and bonus",
        "Remote work flexibility",
        "Health insurance and retirement plans",
      ],
      employer: {
        company_name: "Your Company",
        logo: "/default-employer.png",
        company_size: "50-200 employees",
        industry: "Technology",
        website: "https://yourcompany.com",
        description:
          "A forward-thinking technology company focused on innovation.",
      },
      has_applied: false,
      is_saved: false,
    };

    setPreviewJob(sampleJob);
    toast.info(
      "AI job preview generated! You can now see a sample of how your job post will appear."
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold mb-4">Create Job</h1>
          <Button
            className="gradient-button"
            variant="outline"
            onClick={handleAIGeneration}
          >
            Create using AI
          </Button>
        </div>
        <div>
          <CreateJobForm formAction={formAction} state={state} />
        </div>
      </div>

      <div className="hidden md:block lg:w-1/2 border-l dark:border-gray-700 overflow-hidden">
        {previewJob ? (
          <div className="h-full">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-700">
              <h2 className="text-xl font-medium">Job Preview</h2>
              <p className="text-sm text-gray-500">
                This is how your job will appear to candidates
              </p>
            </div>
            <JobDetails
              selectedJob={previewJob}
              className="h-full border-none"
              forceSheetOnLargeScreens={true}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-50 dark:bg-gray-800/20">
            <div className="text-center max-w-md">
              <h3 className="text-xl font-medium mb-2">Job Preview</h3>
              <p className="text-gray-500 mb-6">
                Click &quot;Create using AI&quot; to generate a preview of your
                job posting
              </p>
              <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-10 bg-white dark:bg-gray-800/30">
                <p className="text-gray-400 dark:text-gray-500">
                  Preview will appear here
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateJob;
