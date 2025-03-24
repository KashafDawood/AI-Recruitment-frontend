import React from "react";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, Share2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/job";


interface JobDetailsProps {
    selectedJob: Job;
}
  
const JobDetails: React.FC<JobDetailsProps> = ({ selectedJob }) => {  
    return (
        <div className="hidden lg:flex lg:w-2/5 flex-col border border-gray-800 rounded-lg relative overflow-y-auto custom-scrollbar">
            <div className="overflow-y-auto h-full custom-scrollbar pb-40">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold dark:text-white">
                      {selectedJob.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-300 mt-1">
                      <span>{selectedJob.company}</span>
                      <span>•</span>
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

                <div className="bg-gray-50 rounded-lg p-4 mb-6 dark:bg-[#232222]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Applicants Summary</h3>
                    <Badge className="bg-green-100 text-green-800 font-medium hover:bg-green-100 hover:text-inherit">
                      {selectedJob.job_status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">67</span>
                        <span className="text-sm text-gray-500">/100</span>
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
                        />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span className="text-sm">New Applicants</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                        <span className="text-sm">Approved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="text-sm">Rejected</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="border rounded-lg p-3">
                    <div className="text-sm text-gray-800 dark:text-gray-200 mb-1">Job Type</div>
                    <div className="font-medium">{selectedJob.job_type}</div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="text-sm text-gray-800 dark:text-gray-200 mb-1">Experience</div>
                    <div className="font-medium">
                      {selectedJob.experience_required}
                    </div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="text-sm text-gray-800 dark:text-gray-200 mb-1">Salary</div>
                    <div className="font-medium">{selectedJob.salary}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">About Job Role</h3>
                  <p className="text-sm text-gray-800 dark:text-gray-300 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Requirements</h3>
                  <ul className="text-sm text-gray-800 dark:text-gray-300 leading-relaxed list-disc pl-5 space-y-2">
                    {selectedJob.required_qualifications.map(
                      (requirement, index) => (
                        <li key={index}>{requirement}</li>
                      )
                    )}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Preferred Qualifications</h3>
                  <ul className="text-sm text-gray-800 dark:text-gray-300 leading-relaxed list-disc pl-5 space-y-2">
                    {selectedJob.preferred_qualifications.map(
                      (qualification, index) => (
                        <li key={index}>{qualification}</li>
                      )
                    )}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Responsibilities</h3>
                  <ul className="text-sm text-gray-800 dark:text-gray-300 leading-relaxed list-disc pl-5 space-y-2">
                    {selectedJob.responsibilities.map(
                      (responsibility, index) => (
                        <li key={index}>{responsibility}</li>
                      )
                    )}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Benefits</h3>
                  <ul className="text-sm text-gray-800 dark:text-gray-300 leading-relaxed list-disc pl-5 space-y-2">
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sticky Apply Job button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t dark:bg-[#121212] dark:border-gray-800">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg dark:bg-blue-500 dark:hover:bg-blue-600">
                Apply Job
              </Button>
            </div>
          </div>
    );
};

export default JobDetails;

