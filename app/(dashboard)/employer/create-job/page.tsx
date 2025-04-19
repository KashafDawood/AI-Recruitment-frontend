"use client";

import { Button } from "@/components/ui/button";
import CreateJobForm from "./createJobForm";
import AiJobForm from "./AiJobForm";
import { createJob } from "@/api/jobs/createJob";
import { generateJobWithAI } from "@/api/ai/generateJob";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import JobPreview from "@/components/jobs/JobPreview";
import { JobPreviewData } from "@/types/job";
import { useUserWithLoading } from "@/hooks/useUser";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const CreateJob: React.FC = () => {
  const [state, formAction] = useActionState(createJob, undefined);
  const [aiState, aiFormAction] = useActionState(generateJobWithAI, undefined);
  const router = useRouter();
  const [formValues, setFormValues] = useState<JobPreviewData>({});
  const { user } = useUserWithLoading();
  const [showAiDialog, setShowAiDialog] = useState(false);

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

  // Handle AI job generation success
  useEffect(() => {
    if (aiState?.message) {
      toast.success(aiState.message);
      // We'll let the onJobGenerated callback handle dialog closing
      // to avoid React ref errors from closing during submission
    }

    if (aiState?.serverError) {
      toast.error(aiState.serverError);
    }
  }, [aiState]);

  const handleAIGeneration = () => {
    setShowAiDialog(true);
  };

  const handleFormChange = (values: Record<string, unknown>) => {
    setFormValues(values as JobPreviewData);
  };

  const handleAiJobGenerated = (jobData: JobPreviewData) => {
    try {
      // First update the form values
      setFormValues(jobData);

      // Then close the dialog - do this last to avoid ref issues
      setTimeout(() => {
        setShowAiDialog(false);
        toast.success(
          "AI job generated successfully! Review and edit if needed."
        );
      }, 100);
    } catch (error) {
      console.error("Error handling generated job:", error);
      // Still try to close the dialog
      setShowAiDialog(false);
    }
  };

  // Safely close dialog without any state updates
  const handleCloseDialog = () => {
    try {
      setShowAiDialog(false);
    } catch (error) {
      console.error("Error closing dialog:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-between items-center h-[82px] p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/50 dark:to-gray-800/30 border-b dark:border-gray-700 sticky top-0 z-10">
          <h1 className="text-2xl text-blue-700 dark:text-blue-400 font-bold">
            Create Job
          </h1>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
            onClick={handleAIGeneration}
          >
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

      <div className="hidden md:block lg:w-1/2 border-l dark:border-gray-700 overflow-hidden">
        <JobPreview formData={formValues} />
      </div>

      {/* AI Job Generation Dialog */}
      {showAiDialog && (
        <Dialog open={showAiDialog} onOpenChange={handleCloseDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10 pb-4">
              <DialogTitle className="text-xl text-blue-700 dark:text-blue-400">
                Generate Job with AI
              </DialogTitle>
              <DialogDescription>
                Provide basic job details and our AI will generate a complete
                job posting for you.
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <AiJobForm
                formAction={aiFormAction}
                state={aiState}
                onJobGenerated={handleAiJobGenerated}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CreateJob;
