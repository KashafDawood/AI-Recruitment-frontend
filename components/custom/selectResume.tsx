import React, { useState, useEffect, useRef } from "react";
import { useUserWithLoading } from "@/hooks/useUser";
import { Button } from "../ui/button";
import { Resumes, useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { updateMe } from "@/api/user/upadateuser";
import { File, FileText, Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";

interface SelectResumeProps {
  selectedResume: string | null;
  setSelectedResume: (resume: string) => void;
  jobId: number;
  onJobChange: () => void;
}

const SelectResume = ({
  selectedResume,
  setSelectedResume,
  jobId,
  onJobChange,
}: SelectResumeProps) => {
  const { user } = useUserWithLoading();
  const { refreshUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const prevJobIdRef = useRef<number | null>(null);

  // Effect to detect job changes and call onJobChange
  useEffect(() => {
    // Only trigger job change callback if this isn't the initial render
    // and the job ID actually changed
    if (prevJobIdRef.current !== null && prevJobIdRef.current !== jobId) {
      onJobChange();
    }

    // Update the ref with current jobId for next comparison
    prevJobIdRef.current = jobId;
  }, [jobId, onJobChange]);

  const onSelectResume = (resume: Resumes) => {
    setSelectedResume(resume.resume);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (extension === "pdf") {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (extension === "doc" || extension === "docx") {
      return <FileText className="h-5 w-5 text-blue-600" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handle file selection after user chooses a file
  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is PDF, DOC, or DOCX
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF, DOC, or DOCX file only.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", file);
      await updateMe(formData);
      await refreshUser();
      toast.success("Resume uploaded successfully.");
      setLoading(false);
    } catch {
      toast.error("Failed to upload resume. Please try again.");
      setLoading(false);
    }
  };

  // Function to trigger file input click
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 overflow-y-auto h-full custom-scrollbar pb-20">
      <h2 className="text-xl font-bold mb-4 dark:text-white">
        Resume Selection
      </h2>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        Please make sure your resume is up to date before submitting your
        application. An updated resume increases your chances of getting
        selected for this position.
      </p>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
        <h3 className="font-medium mb-3 dark:text-white">Your Resumes</h3>

        {user?.resumes && Object.values(user.resumes).length > 0 ? (
          <div className="space-y-3">
            {Object.values(user.resumes)
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((resume: Resumes) => (
                <div
                  onClick={() => onSelectResume(resume)}
                  key={resume.created_at}
                  className={`border rounded-lg p-4 bg-white dark:bg-gray-900 cursor-pointer transition-colors ${
                    selectedResume === resume.resume
                      ? "border-blue-500 dark:border-blue-500 ring-1 ring-blue-500"
                      : "dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <p className="flex gap-2 items-center pb-1 font-medium dark:text-white">
                        {getFileIcon(resume.name)}
                        <span className="truncate max-w-[200px]">
                          {resume.name}
                        </span>
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Uploaded:{" "}
                          {new Date(resume.created_at).toLocaleDateString()}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {resume.name.split(".").pop()?.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    {selectedResume === resume.resume && (
                      <div className="text-blue-600 dark:text-blue-500 font-medium text-sm">
                        Selected
                      </div>
                    )}
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
          />
          <Button
            onClick={openFileSelector}
            variant="outline"
            disabled={loading}
            className="text-blue-600 dark:text-blue-500 border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            {loading ? "Uploading..." : "Upload Resume (PDF, DOC, DOCX)"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectResume;
