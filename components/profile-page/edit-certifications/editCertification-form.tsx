"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DatePicker } from "@/components/custom/datePicker";
import { updateCertificate } from "@/api/user/updateCertificate";
import { useUserStore } from "@/store/userStore";
import { Award, ExternalLink } from "lucide-react";
import { vibrantColors } from "@/components/custom/GlowCard";

interface Certification {
  source?: string;
  source_url?: string;
  date_obtained?: string; // Format: yyyy-mm-dd
  certification_name?: string;
}

export default function EditCertificationForm({
  certification,
  onCancel,
  onSuccess,
}: {
  certification: Certification;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [dateObtained, setDateObtained] = useState<Date | undefined>(
    certification.date_obtained
      ? new Date(certification.date_obtained)
      : undefined
  );
  const [certificationName, setCertificationName] = useState(
    certification.certification_name || ""
  );
  const [source, setSource] = useState(certification.source || "");
  const [sourceUrl, setSourceUrl] = useState(certification.source_url || "");
  const { refreshUser } = useUserStore();

  // Choose a random color for the preview card
  const cardColor = useMemo(
    () => vibrantColors[Math.floor(Math.random() * vibrantColors.length)],
    []
  );

  // Format date for display
  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    const certificationData = {
      certification_name: certificationName,
      original_certification_name: certification.certification_name,
      source: source,
      source_url: sourceUrl,
      date_obtained: dateObtained
        ? dateObtained.toISOString().split("T")[0]
        : "",
    };

    const errors: { [key: string]: string } = {};
    if (!certificationData.certification_name)
      errors.certification_name = "Certification name is required";
    if (!certificationData.date_obtained)
      errors.date_obtained = "Date obtained is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      await updateCertificate(certificationData);
      await refreshUser();
      toast.success("Certification updated successfully");
      if (onSuccess) onSuccess();
    } catch {
      toast.error("Failed to update certification");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Edit Certification</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Form section */}
        <div className="w-full md:w-1/2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="certification_name">Certification Name</Label>
              <Input
                id="certification_name"
                name="certification_name"
                value={certificationName}
                onChange={(e) => setCertificationName(e.target.value)}
                placeholder="e.g., AWS Certified Solutions Architect"
                className="border-gray-300 dark:border-gray-700"
              />
              {formErrors.certification_name && (
                <p className="text-red-500 text-sm">
                  {formErrors.certification_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Issuing Organization</Label>
              <Input
                id="source"
                name="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g., Amazon Web Services"
                className="border-gray-300 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source_url">Certification URL (Optional)</Label>
              <Input
                id="source_url"
                name="source_url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://..."
                className="border-gray-300 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_obtained">Date Obtained</Label>
              <DatePicker
                date={dateObtained}
                onDateChange={(date) => setDateObtained(date)}
                placeholder="Select date"
                className="w-full border rounded-md"
              />
              {formErrors.date_obtained && (
                <p className="text-red-500 text-sm">
                  {formErrors.date_obtained}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="rounded-lg px-6"
              >
                Cancel
              </Button>
              <Button
                disabled={isSubmitting}
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6"
              >
                {isSubmitting ? "Updating..." : "Update Certification"}
              </Button>
            </div>
          </form>
        </div>

        {/* Preview card section */}
        <div className="w-full md:w-1/2">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <div className="group relative transform perspective-800">
            <div className="h-full">
              <div
                className="relative h-full z-10 overflow-hidden bg-card bg-opacity-20 backdrop-blur-sm border border-primary/30 p-6 rounded-lg shadow-md dark:bg-gray-900 bg-gray-100"
                style={{
                  borderColor: `${cardColor}30`,
                }}
              >
                <div className="flex items-start mb-3">
                  <Award style={{ color: cardColor }} className="h-8 w-8" />
                </div>

                <h3 className="text-card-foreground text-xl font-semibold mb-2">
                  {certificationName || "Certification Name"}
                </h3>

                <div className="flex items-center text-muted-foreground text-sm">
                  <span>{source || "Issuing Organization"}</span>
                  {sourceUrl && (
                    <ExternalLink className="h-3 w-3 ml-1 inline" />
                  )}
                </div>

                {/* Date at bottom right */}
                <div className="absolute bottom-4 right-6">
                  <span style={{ color: cardColor }} className="text-sm">
                    {formatDate(dateObtained)}
                  </span>
                </div>

                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(45deg, ${cardColor}10, ${cardColor}20)`,
                  }}
                ></div>

                <div
                  className="absolute -inset-2 z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                  style={{
                    background: `linear-gradient(45deg, ${cardColor}20, transparent)`,
                  }}
                ></div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            This is how your certification will appear on your profile
          </p>
        </div>
      </div>
    </div>
  );
}
