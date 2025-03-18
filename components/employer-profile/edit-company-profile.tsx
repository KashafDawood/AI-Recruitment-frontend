import { Building2, MapPin, Users, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { User, useUserStore } from "@/store/userStore";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { updateMe } from "@/api/user/upadateuser";
import { toast } from "sonner";
import OptimizeImage from "@/components/custom/optimizeImage";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import SocialLinks from "./social-links";
import { RichTextEditor } from "../custom/richTextEditor";

type EditCompanyProfileCardProps = {
  user: User | null;
  onEditCancel?: () => void;
};

export const EditCompanyProfileCard: React.FC<EditCompanyProfileCardProps> = ({
  user,
  onEditCancel,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    company_name: user?.company_name || "",
    industry: user?.industry || "",
    company_size: user?.company_size || "",
    address: user?.address || "",
    about_company: user?.about_company || "",
    socials: user?.socials || {},
  });
  const { refreshUser } = useUserStore();

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    } else {
      setPreview(null);
      setFile(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRichTextChange = (html: string) => {
    setFormData((prev) => ({
      ...prev,
      about_company: html,
    }));
  };

  const handleSocialsChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [platform]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const formDataObj = new FormData();

      formDataObj.append("company_name", formData.company_name);
      formDataObj.append("industry", formData.industry);
      formDataObj.append("company_size", formData.company_size);
      formDataObj.append("address", formData.address);
      formDataObj.append("about_company", formData.about_company);

      if (formData.socials) {
        formDataObj.append("socials", JSON.stringify(formData.socials));
      }

      if (file) formDataObj.append("logo", file);

      await updateMe(formDataObj);
      await refreshUser();
      toast.success("Company profile updated successfully!");

      setTimeout(() => {
        if (onEditCancel) {
          onEditCancel();
        }
      }, 1500);
    } catch {
      toast.error("Failed to update company profile. Please try again.");
    }
  };

  return (
    <Card className="relative dark:bg-gray-900">
      {onEditCancel && (
        <Button
          onClick={onEditCancel}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-20 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700"
          title="Cancel Edit"
        >
          <X size={18} />
        </Button>
      )}
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-md">
            <label
              htmlFor="company-logo"
              className="cursor-pointer block relative h-full w-full"
            >
              {preview ? (
                <Image
                  src={preview}
                  alt="Company Logo Preview"
                  width={100}
                  height={100}
                  className="rounded-full shadow-md object-cover h-full w-full"
                />
              ) : (
                <OptimizeImage
                  className="rounded-full shadow-md"
                  src={user?.logo}
                  width={100}
                  alt={user?.company_name || "company"}
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium">Change</span>
              </div>
            </label>
            <input
              id="company-logo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChangeFile}
            />
          </div>
          <div>
            <Input
              name="company_name"
              placeholder="Company Name"
              className="text-2xl font-bold"
              value={formData.company_name}
              onChange={handleInputChange}
            />
            <Input
              name="industry"
              placeholder="Industry"
              className="text-muted-foreground mt-1"
              value={formData.industry}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">About the Company</h3>
          <RichTextEditor
            showToolbar={false}
            content={formData.about_company}
            onChange={handleRichTextChange}
            placeholder="Describe your company..."
          />
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-muted-foreground mt-2" />
            <div className="flex-1">
              <p className="text-sm font-medium">Industry</p>
              <Input
                name="industry"
                placeholder="Industry"
                className="text-sm"
                value={formData.industry}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-muted-foreground mt-2" />
            <div className="flex-1">
              <p className="text-sm font-medium">Company Size</p>
              <Input
                name="company_size"
                placeholder="e.g., 50-100 employees"
                className="text-sm"
                value={formData.company_size}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-2" />
            <div className="flex-1">
              <p className="text-sm font-medium">Address</p>
              <Input
                name="address"
                placeholder="Company Address"
                className="text-sm"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-2">Social Links</h3>
          <SocialLinks
            socials={formData.socials}
            onChange={handleSocialsChange}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onEditCancel} variant="outline" className="mr-2">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="default">
          Update Company Profile
        </Button>
      </CardFooter>
    </Card>
  );
};
