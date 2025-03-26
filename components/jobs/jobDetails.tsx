import React from "react";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, Share2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/job";
import ProfileCard from "@/components/jobs/ProfileCard";
import { applyForJob } from "@/api/candidate/ApplyForJob";
import { toast } from "sonner";
import { useUserWithLoading } from "@/hooks/useUser";
import { Resumes } from "@/store/userStore";

interface JobDetailsProps {
<<<<<<< HEAD
  selectedJob: Job;
}

const JobDetails: React.FC<JobDetailsProps> = ({ selectedJob }) => {
  const [isApplying, setIsApplying] = React.useState(false);
  const { user } = useUserWithLoading();
=======
    selectedJob: Job;
    forceSheetOnLargeScreens?: boolean; // New prop
}
  
const JobDetails: React.FC<JobDetailsProps> = ({ selectedJob, forceSheetOnLargeScreens = false }) => {  
  if (!selectedJob) {
    console.log("No job selected"); // Debugging log
    return <div>No job selected</div>;
  }

  console.log("Rendering JobDetails for:", selectedJob); // Debugging log
>>>>>>> 0d5df1dc23bed2b64d31b52c22c9714c3971a9ce

  const applyJob = async () => {
    setIsApplying(true);

    // // Retrieve the logged-in user from local storage
    // const userData = JSON.parse(localStorage.getItem("user-store") || "{}")
    //   ?.state?.user;

    // // Extract the resume dynamically
    // const resumeEntries = userData?.resumes
    //   ? Object.values(userData.resumes)
    //   : [];
    // const resumeUrl =
    //   resumeEntries.length > 0
    //     ? (resumeEntries[0] as { resume: string }).resume
    //     : null;

    // // Check if user and resume exist
    // if (!userData || !userData.id || !userData.username || !resumeUrl) {
    //   toast.error(
    //     "User data or resume not found. Please ensure you're logged in and have uploaded a resume."
    //   );
    //   return;
    // }

    // try {
    //   const applicationData = {
    //     resume: resumeUrl,
    //     job: selectedJob.id,
    //   };

    //   const response = await applyForJob(applicationData);
    //   console.log("Application successful:", response);
    //   toast.success("You have successfully applied for this job!");
    // } catch (error: unknown) {
    //   console.error("Application failed:", error);
    //   toast.error(
    //     error instanceof Error
    //       ? error.message
    //       : "Failed to apply for the job. Please try again."
    //   );
    // }
  };
<<<<<<< HEAD

  return (
    <div className="lg:flex lg:w-2/5 flex-col h-full lg:border dark:border-gray-800 rounded-lg relative overflow-y-auto custom-scrollbar">
      {isApplying ? (
        <div className="p-6 overflow-y-auto h-full custom-scrollbar pb-20">
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            Resume Selection
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            Please make sure your resume is up to date before submitting your
            application. An updated resume increases your chances of getting
            selected for this position.
          </p>
=======
  
  const containerClass = forceSheetOnLargeScreens
    ? "w-full border-none"
    : "lg:w-2/5 lg:border"; // Conditionally apply the width class

    return (
        <div className={`${containerClass} lg:flex flex-col h-full dark:border-gray-800 rounded-lg relative overflow-y-auto custom-scrollbar`}>
            <div className="overflow-y-auto h-full custom-scrollbar pb-20">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold dark:text-white">
                      {selectedJob.title}
                    </h2>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2 text-sm text-gray-800 dark:text-gray-300 mt-1">
                      <span>{selectedJob.company}</span>
                      <span className="hidden lg:block">•</span>
                      <span>{selectedJob.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg h-10 w-10"
                    >
                      <BookmarkIcon className="h-5 w-5 text-blue-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg h-10 w-10"
                    >
                      <Share2Icon className="h-5 w-5 text-blue-600" />
                    </Button>
                  </div>
                </div>
>>>>>>> 0d5df1dc23bed2b64d31b52c22c9714c3971a9ce

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-3 dark:text-white">Your Resumes</h3>

            {user?.resumes && Object.values(user.resumes).length > 0 ? (
              <div className="space-y-3">
                {Object.values(user.resumes).map((resume: Resumes) => (
                  <div
                    key={resume.created_at}
                    className="border dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-900 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium dark:text-white">
                          {resume.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Uploaded:{" "}
                          {new Date(resume.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-blue-600 dark:border-blue-500 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-500"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 border border-dashed dark:border-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  No resumes found
                </p>
              </div>
            )}

            <div className="text-center my-4 p-6 border border-dashed dark:border-gray-700 rounded-lg">
              <Button
                variant="outline"
                className="text-blue-600 dark:text-blue-500 border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                Upload Resume
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-y-auto h-full custom-scrollbar pb-20">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold dark:text-white">
                  {selectedJob.title}
                </h2>
                <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2 text-sm text-gray-600 dark:text-gray-300 mt-1">
                  <span>{selectedJob.company}</span>
                  <span className="hidden lg:block">•</span>
                  <span>{selectedJob.location}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-lg h-10 w-10 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <BookmarkIcon className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-lg h-10 w-10 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Share2Icon className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium dark:text-gray-200">
                  Applicants Summary
                </h3>
                <Badge
                  variant="outline"
                  className={`font-medium ${
                    selectedJob.job_status.toLowerCase() === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {selectedJob.job_status}
                </Badge>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold dark:text-white">
                      67
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      /100
                    </span>
                  </div>
                  {/* This would be a pie chart in a real implementation */}
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full -rotate-90"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#e0e0e0"
                      strokeWidth="12"
                      className="dark:stroke-gray-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#4f46e5"
                      strokeWidth="12"
                      strokeDasharray="251.2"
                      strokeDashoffset="75"
                      className="dark:stroke-indigo-500"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#3b82f6"
                      strokeWidth="12"
                      strokeDasharray="251.2"
                      strokeDashoffset="175"
                      className="dark:stroke-blue-500"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth="12"
                      strokeDasharray="251.2"
                      strokeDashoffset="240"
                      className="dark:stroke-red-500"
                    />
                  </svg>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-sm dark:text-gray-300">
                      New Applicants
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500"></span>
                    <span className="text-sm dark:text-gray-300">Approved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-sm dark:text-gray-300">Rejected</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="border dark:border-gray-800 rounded-lg p-3 bg-white dark:bg-gray-900">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Job Type
                </div>
                <div className="font-medium dark:text-white">
                  {selectedJob.job_type}
                </div>
              </div>
              <div className="border dark:border-gray-800 rounded-lg p-3 bg-white dark:bg-gray-900">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Experience
                </div>
                <div className="font-medium dark:text-white">
                  {selectedJob.experience_required}
                </div>
              </div>
              <div className="border dark:border-gray-800 rounded-lg p-3 bg-white dark:bg-gray-900">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Salary
                </div>
                <div className="font-medium dark:text-white">
                  {selectedJob.salary}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3 dark:text-white">
                About Job Role
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedJob.description}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3 dark:text-white">Requirements</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed list-disc pl-5 space-y-2">
                {selectedJob.required_qualifications.map(
                  (requirement, index) => (
                    <li key={index}>{requirement}</li>
                  )
                )}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3 dark:text-white">
                Preferred Qualifications
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed list-disc pl-5 space-y-2">
                {selectedJob.preferred_qualifications.map(
                  (qualification, index) => (
                    <li key={index}>{qualification}</li>
                  )
                )}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3 dark:text-white">
                Responsibilities
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed list-disc pl-5 space-y-2">
                {selectedJob.responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3 dark:text-white">Benefits</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed list-disc pl-5 space-y-2">
                {selectedJob.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>

            {/* employer profile card */}
            {selectedJob.employer && (
              <ProfileCard employer={selectedJob.employer} />
            )}
          </div>
        </div>
      )}

      {/* Sticky Apply Job button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
        {isApplying ? (
          <Button
            onClick={applyJob}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Submit
          </Button>
        ) : (
          <Button
            onClick={applyJob}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Apply for Job
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
