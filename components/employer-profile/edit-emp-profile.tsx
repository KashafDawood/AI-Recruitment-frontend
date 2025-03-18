import { Globe, Mail, Phone, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { User, useUserStore } from "@/store/userStore";
import React, { useState } from "react";
import { Button } from "../ui/button";
import ProfileImageSection from "../profile-page/edit-profile-card/ProfileImageSection";
import { updateMe } from "@/api/user/upadateuser";
import { toast } from "sonner";

type EditProfileCardProps = {
  user: User | null;
  onEditCancel?: () => void;
  onChange?: (file: File | null) => void;
};

export const EditEmpProfileCard: React.FC<EditProfileCardProps> = ({
  user,
  onEditCancel,
  onChange,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    website: user?.website || "",
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

    if (onChange) onChange(selectedFile);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const formDataObj = new FormData();

      formDataObj.append("name", formData.name);
      formDataObj.append("phone", formData.phone);
      formDataObj.append("website", formData.website);

      if (file) formDataObj.append("photo", file);

      await updateMe(formDataObj);
      await refreshUser();
      toast.success("Profile updated successfully!");

      setTimeout(() => {
        if (onEditCancel) {
          onEditCancel();
        }
      }, 1500);
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <Card className="relative dark:bg-gray-900 flex flex-col justify-between">
      {onEditCancel && (
        <Button
          onClick={onEditCancel}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-20 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700"
          title="Edit Profile"
        >
          <X size={18} />
        </Button>
      )}
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <ProfileImageSection
            user={user}
            preview={preview}
            onChange={handleChangeFile}
          />
          <input
            name="name"
            placeholder="Name"
            className="bg-transparent inline-block border-b-2 border-black dark:border-white outline-none text-center text-2xl font-bold mt-3"
            style={{
              minWidth: "180px",
              width: `${Math.max((formData.name || "").length, 12) * 0.8}em`,
            }}
            type="text"
            value={formData.name || ""}
            onChange={handleInputChange}
          />
          <p className="text-muted-foreground">@{user?.username}</p>
        </div>
      </CardContent>
      <div>
        <CardHeader>
          <h2 className="text-xl font-semibold">Contact Information</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <div>
                <p className="text-sm text-blue-600 hover:underline">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <input
                name="phone"
                className="bg-transparent inline-block border-b-2 border-black dark:border-white outline-none text-center text-sm"
                style={{
                  minWidth: "180px",
                  width: `${
                    Math.max((formData.phone || "").length, 12) * 0.6
                  }em`,
                }}
                type="text"
                value={formData.phone || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-start gap-3">
            <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Website</p>
              <input
                name="website"
                className="bg-transparent inline-block border-b-2 border-black dark:border-white outline-none text-center text-sm"
                style={{
                  minWidth: "180px",
                  width: `${
                    Math.max((formData.website || "").length, 12) * 0.6
                  }em`,
                }}
                type="url"
                value={formData.website || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit} size="lg" variant={"default"}>
            Update
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};
