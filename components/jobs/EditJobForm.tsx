import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Job } from "@/types/job";
import {
  Check,
  Loader2,
  Plus,
  Save,
  X,
  Trash2,
  Edit,
  AlertTriangle,
  Briefcase,
  Star,
  Gift,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { updateJob, UpdateJobData } from "@/api/jobs/updateJob";
import { toast } from "sonner";
import JobStatusToggle from "@/components/jobs/JobStatusToggle";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EditableListProps {
  items: string[];
  onChange: (newItems: string[]) => void;
  label: string;
  placeholder?: string;
  icon?: React.ReactNode;
}

const EditableList: React.FC<EditableListProps> = ({
  items,
  onChange,
  label,
  placeholder,
  icon,
}) => {
  const [newItem, setNewItem] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAddItem = () => {
    if (newItem.trim()) {
      const updatedItems = [...items, newItem.trim()];
      onChange(updatedItems);
      setNewItem("");
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onChange(updatedItems);
    if (editIndex === index) {
      setEditIndex(null);
    }
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditValue(items[index]);
  };

  const saveEdit = () => {
    if (editIndex !== null && editValue.trim()) {
      const updatedItems = [...items];
      updatedItems[editIndex] = editValue.trim();
      onChange(updatedItems);
      setEditIndex(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editIndex !== null) {
        saveEdit();
      } else {
        handleAddItem();
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-1.5">
          {icon && <span className="text-primary">{icon}</span>}
          {label}
        </Label>
        <Badge variant="outline" className="font-mono text-xs">
          {items.length} {items.length === 1 ? "item" : "items"}
        </Badge>
      </div>

      <AnimatePresence>
        {items.length > 0 ? (
          <motion.div
            className="space-y-2 rounded-md border p-2 border-dashed"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {items.map((item, index) => (
              <motion.div
                key={`${index}-${item.substring(0, 10)}`}
                className={cn(
                  "flex items-center justify-between rounded-md p-2 transition-colors",
                  editIndex === index
                    ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750"
                )}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {editIndex === index ? (
                  <div className="flex w-full items-center gap-2">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="h-8"
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditIndex(null)}
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={saveEdit}
                        className="h-8 w-8 text-green-500"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-sm">{item}</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(index)}
                        className="h-7 w-7 text-gray-500 hover:text-blue-500"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                        className="h-7 w-7 text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-16 rounded-md border border-dashed text-gray-400 dark:text-gray-500 text-sm">
            No items added yet
          </div>
        )}
      </AnimatePresence>

      <div className="flex space-x-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder || `Add ${label.toLowerCase()}`}
          className="h-10"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAddItem}
          className="h-10 gap-1.5 px-3"
          disabled={!newItem.trim()}
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  );
};

interface EditJobFormProps {
  job: Job;
  onJobUpdated?: (updatedJob: Job) => void;
}

const EditJobForm: React.FC<EditJobFormProps> = ({ job, onJobUpdated }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateJobData>({
    title: job.title || "",
    company: job.company || "",
    location: job.location || "",
    experience: job.experience_required || "",
    experience_level:
      (job.experience_level as "entry" | "mid" | "senior") || "mid",
    salary: job.salary || "",
    description: Array.isArray(job.description)
      ? job.description
      : job.description
      ? [job.description]
      : [],
    responsibilities: Array.isArray(job.responsibilities)
      ? job.responsibilities
      : [],
    required_qualifications: Array.isArray(job.required_qualifications)
      ? job.required_qualifications
      : [],
    preferred_qualifications: Array.isArray(job.preferred_qualifications)
      ? job.preferred_qualifications
      : [],
    benefits: Array.isArray(job.benefits) ? job.benefits : [],
    job_type:
      (job.job_type as
        | "full time"
        | "part time"
        | "contract"
        | "temporary"
        | "internship") || "full time",
    job_location_type:
      (job.job_location_type as "remote" | "onsite" | "hybrid") || "onsite",
    job_status: (job.job_status as "open" | "closed" | "draft") || "open",
  });

  // Track if form has been changed
  const [isDirty, setIsDirty] = useState(false);

  const updateFormData = (updates: Partial<UpdateJobData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...updates };
      // Set form as dirty when changes are made
      setIsDirty(true);
      return newData;
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    updateFormData({ [name]: value });
  };

  const handleStatusChange = (newStatus: "open" | "closed" | "draft") => {
    updateFormData({ job_status: newStatus });
  };

  const handleListChange = (name: string, newItems: string[]) => {
    updateFormData({ [name]: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateJob(job.id, formData);

      if (result.success) {
        toast.success("Job updated successfully");
        setIsDirty(false);
        if (onJobUpdated && result.job) {
          onJobUpdated(result.job);
        }
      } else {
        if (result.serverError) {
          toast.error(result.serverError);
        } else if (result.errors) {
          const errorMessage = Object.entries(result.errors)
            .map(([field, errors]) => `${field}: ${errors}`)
            .join(", ");
          toast.error(`Validation errors: ${errorMessage}`);
        }
      }
    } catch (error) {
      toast.error("Failed to update job");
      console.error("Error updating job:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="overflow-hidden border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 px-6 border-b dark:border-gray-700">
          <CardTitle className="text-xl text-blue-700 dark:text-blue-400">
            Basic Information
          </CardTitle>
          <CardDescription className="text-blue-600/70 dark:text-blue-300/70">
            Update the essential details of your job listing
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium">
                Company <span className="text-red-500">*</span>
              </Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                className="h-11"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary" className="text-sm font-medium">
                Salary Range
              </Label>
              <Input
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="h-11"
                placeholder="$80,000 - $120,000"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="job_type" className="text-sm font-medium">
                Job Type
              </Label>
              <Select
                value={formData.job_type}
                onValueChange={(value) => handleSelectChange("job_type", value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="full time">Full Time</SelectItem>
                    <SelectItem value="part time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="job_location_type"
                className="text-sm font-medium"
              >
                Work Location
              </Label>
              <Select
                value={formData.job_location_type}
                onValueChange={(value) =>
                  handleSelectChange("job_location_type", value)
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select work location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience_level" className="text-sm font-medium">
                Experience Level
              </Label>
              <Select
                value={formData.experience_level}
                onValueChange={(value) =>
                  handleSelectChange("experience_level", value)
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience" className="text-sm font-medium">
              Experience Required <span className="text-red-500">*</span>
            </Label>
            <Input
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
              className="h-11"
              placeholder="3+ years of experience with React"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_status" className="text-sm font-medium">
              Job Status
            </Label>
            <div className="mt-2">
              <JobStatusToggle
                jobId={job.id}
                currentStatus={
                  formData.job_status as "open" | "closed" | "draft"
                }
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 px-6 border-b dark:border-gray-700">
          <CardTitle className="text-xl text-blue-700 dark:text-blue-400">
            Job Details
          </CardTitle>
          <CardDescription className="text-blue-600/70 dark:text-blue-300/70">
            Provide detailed information about the position
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Job Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={
                Array.isArray(formData.description)
                  ? formData.description.join("\n\n")
                  : ""
              }
              onChange={(e) =>
                handleListChange(
                  "description",
                  e.target.value.split("\n\n").filter(Boolean)
                )
              }
              required
              className="min-h-[150px]"
            />
          </div>

          <EditableList
            items={formData.responsibilities || []}
            onChange={(newItems) =>
              handleListChange("responsibilities", newItems)
            }
            label="Responsibilities"
            placeholder="Add a job responsibility"
            icon={<Briefcase className="h-4 w-4" />}
          />

          <EditableList
            items={formData.required_qualifications || []}
            onChange={(newItems) =>
              handleListChange("required_qualifications", newItems)
            }
            label="Required Qualifications"
            placeholder="Add required qualification"
            icon={<Check className="h-4 w-4" />}
          />

          <EditableList
            items={formData.preferred_qualifications || []}
            onChange={(newItems) =>
              handleListChange("preferred_qualifications", newItems)
            }
            label="Preferred Qualifications"
            placeholder="Add preferred qualification"
            icon={<Star className="h-4 w-4" />}
          />

          <EditableList
            items={formData.benefits || []}
            onChange={(newItems) => handleListChange("benefits", newItems)}
            label="Benefits"
            placeholder="Add a benefit"
            icon={<Gift className="h-4 w-4" />}
          />
        </CardContent>
      </Card>

      {isDirty && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-4 z-10"
        >
          <Card className="border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20 shadow-lg">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">You have unsaved changes</span>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="gap-2"
                >
                  <X className="h-4 w-4" /> Discard
                </Button>
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </form>
  );
};

export default EditJobForm;
