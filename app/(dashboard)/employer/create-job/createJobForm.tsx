"use client";

import { useState } from "react";
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

interface CreateJobFormProps {
  formAction: (payload: FormData) => void;
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

const CreateJobForm: React.FC<CreateJobFormProps> = ({ formAction, state }) => {
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

  // Helper function to handle array field updates
  const updateArrayField = (
    index: number,
    value: string,
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  // Helper function to add new item to arrays
  const addArrayItem = (
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setItems([...items, ""]);
  };

  // Helper function to remove item from arrays
  const removeArrayItem = (
    index: number,
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  return (
    <form action={formAction}>
      <div className="grid gap-6">
        <Card className="w-full p-4">
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Senior Software Engineer"
                required
              />
              {state?.errors?.title && (
                <p className="text-red-500 text-sm">{state.errors.title}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                type="text"
                placeholder="Your Company"
              />
              {state?.errors?.company && (
                <p className="text-red-500 text-sm">{state.errors.company}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="New York, NY"
                required
              />
              {state?.errors?.location && (
                <p className="text-red-500 text-sm">{state.errors.location}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="experience">Experience Required *</Label>
              <Input
                id="experience"
                name="experience"
                type="text"
                placeholder="3+ years"
                required
              />
              {state?.errors?.experience && (
                <p className="text-red-500 text-sm">
                  {state.errors.experience}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="experience_level">Experience Level</Label>
              <Select name="experience_level" defaultValue="entry">
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                </SelectContent>
              </Select>
              {state?.errors?.experience_level && (
                <p className="text-red-500 text-sm">
                  {state.errors.experience_level}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                name="salary"
                type="text"
                placeholder="$80,000 - $120,000"
              />
              {state?.errors?.salary && (
                <p className="text-red-500 text-sm">{state.errors.salary}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="job_type">Job Type</Label>
              <Select name="job_type" defaultValue="full time">
                <SelectTrigger>
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
                <p className="text-red-500 text-sm">{state.errors.job_type}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="job_location_type">Job Location Type</Label>
              <Select name="job_location_type" defaultValue="onsite">
                <SelectTrigger>
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

            {/* Description section - required */}
            <div className="grid gap-2">
              <Label>Job Description *</Label>
              {descriptionItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    name="description"
                    placeholder={`Point ${index + 1}`}
                    value={item}
                    onChange={(e) =>
                      updateArrayField(
                        index,
                        e.target.value,
                        descriptionItems,
                        setDescriptionItems
                      )
                    }
                    className="min-h-[100px]"
                    required={index === 0}
                  />
                  {descriptionItems.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        removeArrayItem(
                          index,
                          descriptionItems,
                          setDescriptionItems
                        )
                      }
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  addArrayItem(descriptionItems, setDescriptionItems)
                }
              >
                Add Description Point
              </Button>
              {state?.errors?.description && (
                <p className="text-red-500 text-sm">
                  {state.errors.description}
                </p>
              )}
            </div>

            {/* Responsibilities section */}
            <div className="grid gap-2">
              <Label>Responsibilities</Label>
              {responsibilityItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    name="responsibilities"
                    placeholder={`Responsibility ${index + 1}`}
                    value={item}
                    onChange={(e) =>
                      updateArrayField(
                        index,
                        e.target.value,
                        responsibilityItems,
                        setResponsibilityItems
                      )
                    }
                  />
                  {responsibilityItems.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        removeArrayItem(
                          index,
                          responsibilityItems,
                          setResponsibilityItems
                        )
                      }
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  addArrayItem(responsibilityItems, setResponsibilityItems)
                }
              >
                Add Responsibility
              </Button>
              {state?.errors?.responsibilities && (
                <p className="text-red-500 text-sm">
                  {state.errors.responsibilities}
                </p>
              )}
            </div>

            {/* Required Qualifications section */}
            <div className="grid gap-2">
              <Label>Required Qualifications</Label>
              {requiredQualifications.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    name="required_qualifications"
                    placeholder={`Qualification ${index + 1}`}
                    value={item}
                    onChange={(e) =>
                      updateArrayField(
                        index,
                        e.target.value,
                        requiredQualifications,
                        setRequiredQualifications
                      )
                    }
                  />
                  {requiredQualifications.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        removeArrayItem(
                          index,
                          requiredQualifications,
                          setRequiredQualifications
                        )
                      }
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  addArrayItem(
                    requiredQualifications,
                    setRequiredQualifications
                  )
                }
              >
                Add Required Qualification
              </Button>
              {state?.errors?.required_qualifications && (
                <p className="text-red-500 text-sm">
                  {state.errors.required_qualifications}
                </p>
              )}
            </div>

            {/* Preferred Qualifications section */}
            <div className="grid gap-2">
              <Label>Preferred Qualifications</Label>
              {preferredQualifications.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    name="preferred_qualifications"
                    placeholder={`Qualification ${index + 1}`}
                    value={item}
                    onChange={(e) =>
                      updateArrayField(
                        index,
                        e.target.value,
                        preferredQualifications,
                        setPreferredQualifications
                      )
                    }
                  />
                  {preferredQualifications.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        removeArrayItem(
                          index,
                          preferredQualifications,
                          setPreferredQualifications
                        )
                      }
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  addArrayItem(
                    preferredQualifications,
                    setPreferredQualifications
                  )
                }
              >
                Add Preferred Qualification
              </Button>
              {state?.errors?.preferred_qualifications && (
                <p className="text-red-500 text-sm">
                  {state.errors.preferred_qualifications}
                </p>
              )}
            </div>

            {/* Benefits section */}
            <div className="grid gap-2">
              <Label>Benefits</Label>
              {benefitItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    name="benefits"
                    placeholder={`Benefit ${index + 1}`}
                    value={item}
                    onChange={(e) =>
                      updateArrayField(
                        index,
                        e.target.value,
                        benefitItems,
                        setBenefitItems
                      )
                    }
                  />
                  {benefitItems.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        removeArrayItem(index, benefitItems, setBenefitItems)
                      }
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem(benefitItems, setBenefitItems)}
              >
                Add Benefit
              </Button>
              {state?.errors?.benefits && (
                <p className="text-red-500 text-sm">{state.errors.benefits}</p>
              )}
            </div>

            {state?.serverError && (
              <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-800">
                {state.serverError}
              </div>
            )}

            {state?.policyViolations && state.policyViolations.length > 0 && (
              <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800">
                <p className="font-semibold">Policy Violations:</p>
                <ul className="list-disc ml-5">
                  {state.policyViolations.map((violation, index) => (
                    <li key={index}>{violation}</li>
                  ))}
                </ul>
              </div>
            )}

            <SubmitButton />
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full mt-4">
      {pending ? "Publishing..." : "Publish Job"}
    </Button>
  );
}

export default CreateJobForm;
