import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { User, useUserStore } from "@/store/userStore";
import { updateMe } from "@/api/user/upadateuser";
import { toast } from "sonner";
import { CardBg } from "./card-bg";
import ProfileImageSection from "./profile-sections/ProfileImageSection";
import SocialMediaSection from "./profile-sections/SocialMediaSection";
import SkillsSection from "./profile-sections/SkillsSection";
import ProfileInfoSection from "./profile-sections/ProfileInfoSection";
import SubmitButton from "./profile-sections/SubmitButton";
import { Button } from "../ui/button";
import { X } from "lucide-react";

type ProfileCardProps = {
  user: User | null;
  onChange?: (file: File | null) => void;
  onEditComplete?: () => void;
};

const EditProfileCard: React.FC<ProfileCardProps> = ({
  user,
  onChange,
  onEditComplete,
}) => {
  // Main state for form data
  const [formData, setFormData] = useState({
    experience: user?.experience || "",
    interest: user?.interests || "",
    name: user?.name || "",
  });

  // State for profile sections
  const [socials, setSocials] = useState<Record<string, string>>(
    user?.socials || {}
  );
  const [skills, setSkills] = useState<string[]>(
    Array.isArray(user?.skills) ? user?.skills : []
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { refreshUser } = useUserStore();

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file changes
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

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      // Create form data for multipart/form-data
      const formDataObj = new FormData();

      // Add text fields
      formDataObj.append("name", formData.name);
      formDataObj.append("interests", formData.interest);

      // Add numeric fields
      const experienceNum = parseInt(formData.experience?.toString() || "0");
      formDataObj.append("experience", experienceNum.toString());

      // Add JSON data
      formDataObj.append("skills", JSON.stringify(skills));
      formDataObj.append("socials", JSON.stringify(socials));

      // Add photo if present
      if (file) {
        formDataObj.append("photo", file);
      }

      // Submit data
      await updateMe(formDataObj);
      await refreshUser();
      toast.success("Profile updated successfully!");

      if (onEditComplete) {
        onEditComplete();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onEditComplete) {
      onEditComplete();
    }
  };

  return (
    <Card className="h-auto rounded-b-none shadow-sm overflow-hidden border-0 items-center relative">
      {/* Background */}
      <div className="absolute top-[-15] inset-0 overflow-hidden">
        <CardBg name={user?.name} />
      </div>

      {/* Cancel Button */}
      {onEditComplete && (
        <Button
          onClick={handleCancel}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-20 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700"
          title="Cancel Editing"
        >
          <X size={18} />
        </Button>
      )}

      <form className="w-full flex py-10" onSubmit={handleSubmit}>
        <div className="py-12 w-full relative z-10">
          <div className="flex flex-col lg:flex-row justify-around items-center px-6 lg:px-12">
            {/* Left Side: Role and Socials */}
            <div className="lg:w-1/4 mb-6 lg:mb-0 text-center lg:text-end">
              <ProfileInfoSection
                label="Update Role"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
              />

              <SocialMediaSection socials={socials} setSocials={setSocials} />
            </div>

            {/* Center: Profile Image */}
            <ProfileImageSection
              user={user}
              preview={preview}
              onChange={handleChangeFile}
            />

            <h1 className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center text-4xl font-black w-full">
              <input
                name="name"
                placeholder="Name"
                className="bg-transparent inline-block border-b-2 border-black dark:border-white outline-none"
                style={{
                  width: `${
                    formData.name.length > 0 ? formData.name.length : 8
                  }ch`,
                }}
                type="text"
                value={formData.name}
                onChange={handleChange}
              />
            </h1>

            {/* Right Side: Experience and Skills */}
            <div className="lg:w-1/4 mt-6 lg:mt-0 text-center lg:text-start">
              <ProfileInfoSection
                label="Update Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                type="number"
                suffix=" years"
                inputClassName="w-6"
              />

              <SkillsSection skills={skills} setSkills={setSkills} />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          <SubmitButton isSubmitting={isSubmitting} />
          {onEditComplete && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="bg-white dark:bg-slate-700"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default EditProfileCard;
