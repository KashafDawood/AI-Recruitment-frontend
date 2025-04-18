"use client";

import { Button } from "@/components/ui/button";
import CreateJobForm from "./createJobForm";
import { createJob } from "@/api/jobs/createJob";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import JobPreview from "@/components/jobs/JobPreview";
import { JobPreviewData } from "@/types/job";
import { useUserWithLoading } from "@/hooks/useUser";

const CreateJob: React.FC = () => {
  const [state, formAction] = useActionState(createJob, undefined);
  const router = useRouter();
  const [formValues, setFormValues] = useState<JobPreviewData>({});
  const { user } = useUserWithLoading();

  // Initialize the form with user's company data if available
  useEffect(() => {
    if (user && user.company_name) {
      setFormValues((prevValues) => ({
        ...prevValues,
        company: user.company_name,
        industry: user.industry || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (state?.message) {
      toast.success(state.message);

      // If job was successfully created and approved without policy violations
      if (state.job && state.approved) {
        // Reset form values
        setFormValues({});

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
    // AI generation logic will go here
  };

  const handleFormChange = (values: Record<string, unknown>) => {
    setFormValues(values as JobPreviewData);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-between items-center h-[82px] p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/50 dark:to-gray-800/30 border-b dark:border-gray-700 sticky top-0 z-10">
          <h1 className="text-2xl text-blue-700 dark:text-blue-400 font-bold">
            Create Job
          </h1>
          <Button className="gradient-button" onClick={handleAIGeneration}>
            Generate with AI
          </Button>
        </div>
        <div className="p-4">
          <CreateJobForm
            formAction={formAction}
            state={state}
            onFormChange={handleFormChange}
            initialValues={formValues as Record<string, unknown>}
          />
        </div>
      </div>

      {/* <div className="hidden md:block lg:w-1/2 border-l dark:border-gray-700 overflow-hidden">
        <JobPreview formData={formValues} />
      </div> */}
    </div>
  );
};

export default CreateJob;
