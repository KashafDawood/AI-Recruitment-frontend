"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormStatus } from "react-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Job } from "@/types/job";
import { PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CreateJobFormProps {
  formAction: (payload: FormData) => void;
  onFormChange?: (values: Record<string, unknown>) => void;
  initialValues?: Record<string, unknown>;
  state?: {
    message?: string;
    job?: Job;
    errors?: {
      title?: string | string[];
      location?: string | string[];
      company?: string | string[];
      experience?: string | string[];
      experience_level?: string | string[];
      salary?: string | string[];
      description?: string | string[];
      responsibilities?: string | string[];
      required_qualifications?: string | string[];
      preferred_qualifications?: string | string[];
      benefits?: string | string[];
      job_type?: string | string[];
      job_location_type?: string | string[];
      job_status?: string | string[];
    };
    serverError?: string;
    fieldErrors?: Record<string, string>;
    policyViolations?: string[];
    approved?: boolean;
  };
}

const CreateJobForm: React.FC<CreateJobFormProps> = ({
  formAction,
  state,
  onFormChange,
  initialValues = {},
}) => {
  const [formValues, setFormValues] = useState<Record<string, unknown>>({
    ...initialValues,
  });
  const [descriptionItems, setDescriptionItems] = useState<string[]>([""]);
  const [responsibilityItems, setResponsibilityItems] = useState<string[]>([
    "",
  ]);
  const [requiredQualifications, setRequiredQualifications] = useState<
    string[]
  >([""]);
  const [preferredQualifications, setPreferredQualifications] = useState<
    string[]
  >([""]);
  const [benefitItems, setBenefitItems] = useState<string[]>([""]);

  // Initialize form values from initialValues
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      setFormValues((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  // Update form values whenever any input changes
  const updateFormValues = (name: string, value: string | string[]) => {
    const newValues = { ...formValues, [name]: value };
    setFormValues(newValues);

    // If onFormChange is provided, call it
    if (onFormChange) {
      const formattedValues = { ...newValues };

      // Convert arrays for preview formatting
      if (Array.isArray(value)) {
        // For preview we keep the arrays as arrays
        formattedValues[name] = value.filter((item) => item.trim() !== "");
      }

      onFormChange(formattedValues);
    }
  };

  // Helper function to handle array field updates
  const updateArrayField = (
    index: number,
    value: string,
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    fieldName: string
  ) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
    updateFormValues(fieldName, newItems);
  };

  // Helper function to add new item to arrays
  const addArrayItem = (
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    fieldName: string
  ) => {
    const newItems = [...items, ""];
    setItems(newItems);
    updateFormValues(fieldName, newItems);
  };

  // Helper function to remove item from arrays
  const removeArrayItem = (
    index: number,
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    fieldName: string
  ) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
      updateFormValues(fieldName, newItems);
    }
  };

  // Handle simple input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateFormValues(name, value);
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    updateFormValues(name, value);
  };

  return (
    <form action={formAction} className="pb-16">
      <div className="grid gap-8">
        {/* Basic Information */}
        <Card className="w-full p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Basic Information
          </h2>
          <CardContent className="p-0 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Senior Software Engineer"
                  required
                  onChange={handleInputChange}
                  value={formValues.title || ""}
                  className="h-11"
                />
                {state?.errors?.title && (
                  <p className="text-red-500 text-sm">{state.errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium">
                  Company
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Your Company"
                  onChange={handleInputChange}
                  value={formValues.company || ""}
                  className="h-11"
                />
                {state?.errors?.company && (
                  <p className="text-red-500 text-sm">{state.errors.company}</p>
                )}
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
                  type="text"
                  placeholder="New York, NY"
                  required
                  onChange={handleInputChange}
                  value={formValues.location || ""}
                  className="h-11"
                />
                {state?.errors?.location && (
                  <p className="text-red-500 text-sm">
                    {state.errors.location}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-medium">
                  Salary Range
                </Label>
                <Input
                  id="salary"
                  name="salary"
                  type="text"
                  placeholder="$80,000 - $120,000"
                  onChange={handleInputChange}
                  value={formValues.salary || ""}
                  className="h-11"
                />
                {state?.errors?.salary && (
                  <p className="text-red-500 text-sm">{state.errors.salary}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-medium">
                  Experience Required <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="experience"
                  name="experience"
                  type="text"
                  placeholder="3+ years"
                  required
                  onChange={handleInputChange}
                  value={formValues.experience || ""}
                  className="h-11"
                />
                {state?.errors?.experience && (
                  <p className="text-red-500 text-sm">
                    {state.errors.experience}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_type" className="text-sm font-medium">
                  Job Type
                </Label>
                <Select
                  name="job_type"
                  value={(formValues.job_type as string) || "full time"}
                  onValueChange={(value) =>
                    handleSelectChange("job_type", value)
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full time">Full Time</SelectItem>
                    <SelectItem value="part time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                {state?.errors?.job_type && (
                  <p className="text-red-500 text-sm">
                    {state.errors.job_type}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="job_location_type"
                  className="text-sm font-medium"
                >
                  Location Type
                </Label>
                <Select
                  name="job_location_type"
                  value={(formValues.job_location_type as string) || "onsite"}
                  onValueChange={(value) =>
                    handleSelectChange("job_location_type", value)
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="onsite">Onsite</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                {state?.errors?.job_location_type && (
                  <p className="text-red-500 text-sm">
                    {state.errors.job_location_type}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card className="w-full p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Job Description
          </h2>
          <CardContent className="p-0 space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium">
                Job Description <span className="text-red-500">*</span>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  Provide a detailed description of the role
                </span>
              </Label>
              {descriptionItems.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <Textarea
                    name="description"
                    placeholder={`Enter job description details...`}
                    value={item}
                    onChange={(e) =>
                      updateArrayField(
                        index,
                        e.target.value,
                        descriptionItems,
                        setDescriptionItems,
                        "description"
                      )
                    }
                    className="min-h-[100px] flex-grow"
                    required={index === 0}
                  />
                  <div className="flex flex-col gap-2 justify-start">
                    {descriptionItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          removeArrayItem(
                            index,
                            descriptionItems,
                            setDescriptionItems,
                            "description"
                          )
                        }
                        className="h-9 w-9 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  addArrayItem(
                    descriptionItems,
                    setDescriptionItems,
                    "description"
                  )
                }
                className="mt-2 text-blue-600 border-blue-300 hover:border-blue-400 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Description Paragraph
              </Button>
              {state?.errors?.description && (
                <p className="text-red-500 text-sm">
                  {state.errors.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Requirements and Responsibilities */}
        <Card className="w-full p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Requirements & Responsibilities
          </h2>
          <CardContent className="p-0 space-y-8">
            {/* Responsibilities Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <Label className="text-sm font-medium">
                  Key Responsibilities
                </Label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Add one responsibility per line
                </span>
              </div>

              <div className="space-y-3">
                {responsibilityItems.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1"></div>
                    <Input
                      name="responsibilities"
                      placeholder="e.g. Lead development of front-end features"
                      value={item}
                      onChange={(e) =>
                        updateArrayField(
                          index,
                          e.target.value,
                          responsibilityItems,
                          setResponsibilityItems,
                          "responsibilities"
                        )
                      }
                      className="flex-grow h-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        responsibilityItems.length > 1
                          ? removeArrayItem(
                              index,
                              responsibilityItems,
                              setResponsibilityItems,
                              "responsibilities"
                            )
                          : null
                      }
                      disabled={responsibilityItems.length <= 1}
                      className={`h-8 w-8 rounded-full ${
                        responsibilityItems.length <= 1
                          ? "text-gray-300"
                          : "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  addArrayItem(
                    responsibilityItems,
                    setResponsibilityItems,
                    "responsibilities"
                  )
                }
                className="mt-2 text-blue-600 border-blue-300 hover:border-blue-400 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Responsibility
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Required Qualifications Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <Label className="text-sm font-medium">
                  Required Qualifications
                </Label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Add one qualification per line
                </span>
              </div>

              <div className="space-y-3">
                {requiredQualifications.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1"></div>
                    <Input
                      name="required_qualifications"
                      placeholder="e.g. Bachelor's degree in Computer Science"
                      value={item}
                      onChange={(e) =>
                        updateArrayField(
                          index,
                          e.target.value,
                          requiredQualifications,
                          setRequiredQualifications,
                          "required_qualifications"
                        )
                      }
                      className="flex-grow h-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        requiredQualifications.length > 1
                          ? removeArrayItem(
                              index,
                              requiredQualifications,
                              setRequiredQualifications,
                              "required_qualifications"
                            )
                          : null
                      }
                      disabled={requiredQualifications.length <= 1}
                      className={`h-8 w-8 rounded-full ${
                        requiredQualifications.length <= 1
                          ? "text-gray-300"
                          : "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  addArrayItem(
                    requiredQualifications,
                    setRequiredQualifications,
                    "required_qualifications"
                  )
                }
                className="mt-2 text-blue-600 border-blue-300 hover:border-blue-400 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Required Qualification
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Preferred Qualifications Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <Label className="text-sm font-medium">
                  Preferred Qualifications
                </Label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Add one qualification per line
                </span>
              </div>

              <div className="space-y-3">
                {preferredQualifications.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-1"></div>
                    <Input
                      name="preferred_qualifications"
                      placeholder="e.g. Experience with React"
                      value={item}
                      onChange={(e) =>
                        updateArrayField(
                          index,
                          e.target.value,
                          preferredQualifications,
                          setPreferredQualifications,
                          "preferred_qualifications"
                        )
                      }
                      className="flex-grow h-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        preferredQualifications.length > 1
                          ? removeArrayItem(
                              index,
                              preferredQualifications,
                              setPreferredQualifications,
                              "preferred_qualifications"
                            )
                          : null
                      }
                      disabled={preferredQualifications.length <= 1}
                      className={`h-8 w-8 rounded-full ${
                        preferredQualifications.length <= 1
                          ? "text-gray-300"
                          : "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  addArrayItem(
                    preferredQualifications,
                    setPreferredQualifications,
                    "preferred_qualifications"
                  )
                }
                className="mt-2 text-blue-600 border-blue-300 hover:border-blue-400 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Preferred Qualification
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <Card className="w-full p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Benefits & Perks
          </h2>
          <CardContent className="p-0 space-y-4">
            <div className="flex justify-between items-baseline">
              <Label className="text-sm font-medium">Benefits Offered</Label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                List the benefits this position offers
              </span>
            </div>

            <div className="space-y-3">
              {benefitItems.map((item, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1"></div>
                  <Input
                    name="benefits"
                    placeholder="e.g. Medical, dental, and vision insurance"
                    value={item}
                    onChange={(e) =>
                      updateArrayField(
                        index,
                        e.target.value,
                        benefitItems,
                        setBenefitItems,
                        "benefits"
                      )
                    }
                    className="flex-grow h-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      benefitItems.length > 1
                        ? removeArrayItem(
                            index,
                            benefitItems,
                            setBenefitItems,
                            "benefits"
                          )
                        : null
                    }
                    disabled={benefitItems.length <= 1}
                    className={`h-8 w-8 rounded-full ${
                      benefitItems.length <= 1
                        ? "text-gray-300"
                        : "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                addArrayItem(benefitItems, setBenefitItems, "benefits")
              }
              className="mt-2 text-blue-600 border-blue-300 hover:border-blue-400 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Benefit
            </Button>
          </CardContent>
        </Card>

        {/* Error and status messages */}
        {state?.serverError && (
          <div className="p-4 bg-red-100 border border-red-300 rounded-md text-red-800">
            <p className="font-medium">Error</p>
            <p className="text-sm">{state.serverError}</p>
          </div>
        )}

        {state?.policyViolations && state.policyViolations.length > 0 && (
          <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800">
            <p className="font-semibold">Policy Violations:</p>
            <ul className="list-disc ml-5 mt-2 text-sm">
              {state.policyViolations.map((violation, index) => (
                <li key={index}>{violation}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[calc(50%-1rem)] p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-700 shadow-lg z-10">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md"
    >
      {pending ? "Publishing..." : "Publish Job"}
    </Button>
  );
}

export default CreateJobForm;
