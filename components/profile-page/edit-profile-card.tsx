import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { User, useUserStore } from "@/store/userStore";
import { updateMe } from "@/api/user/upadateuser";
import { toast } from "sonner";
import { CardBg } from "./card-bg";
import ProfileImageSection from "./profile-sections/ProfileImageSection";
import SocialMediaSection from "./profile-sections/SocialMediaSection";
import SkillsSection from "./profile-sections/SkillsSection";
import ProfileInfoSection from "./profile-sections/ProfileInfoSection";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import UpdateButton from "../custom/updateButton";

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
  const [updateState, setUpdateState] = useState<
    "initial" | "loading" | "success"
  >("initial");

  // Keep original data for reset functionality
  const [originalData, setOriginalData] = useState({
    formData: { ...formData },
    socials: { ...socials },
    skills: [...skills],
    preview: null as string | null,
    file: null as File | null,
  });

  // Track if form is dirty (has changes)
  const [formDirty, setFormDirty] = useState(false);

  // Set original data on component mount
  useEffect(() => {
    setOriginalData({
      formData: { ...formData },
      socials: { ...socials },
      skills: [...skills],
      preview: null,
      file: null,
    });
  }, [user, formData, socials, skills]);

  // Check if form is dirty when any input changes
  useEffect(() => {
    const isDirty =
      JSON.stringify(formData) !== JSON.stringify(originalData.formData) ||
      JSON.stringify(socials) !== JSON.stringify(originalData.socials) ||
      JSON.stringify(skills) !== JSON.stringify(originalData.skills) ||
      file !== originalData.file;

    setFormDirty(isDirty);

    // Reset to initial state if form changes
    if (isDirty && updateState === "success") {
      setUpdateState("initial");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, socials, skills, file]);

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
  const handleSubmit = async () => {
    try {
      setUpdateState("loading");

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

      // Update the original data with current state so form is no longer dirty
      setOriginalData({
        formData: { ...formData },
        socials: { ...socials },
        skills: [...skills],
        preview,
        file,
      });

      setUpdateState("success");

      setTimeout(() => {
        if (onEditComplete) {
          onEditComplete();
        }
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
      setUpdateState("initial");
    }
  };

  const handleReset = () => {
    // Reset all form fields to original values without canceling edit mode
    setFormData({ ...originalData.formData });
    setSocials({ ...originalData.socials });
    setSkills([...originalData.skills]);
    setPreview(originalData.preview);
    setFile(originalData.file);

    // Don't call onEditComplete here so we stay in edit mode
  };

  const handleCancel = () => {
    if (onEditComplete) {
      onEditComplete();
    }
  };

  return (
    <Card className="h-auto pb-8 rounded-b-none shadow-sm overflow-hidden border-0 items-center relative">
      {/* Background */}
      <div className="absolute top-[-15] inset-0 overflow-hidden">
        <CardBg name={user?.name} />
      </div>

      {/* Cancel Button */}
      {onEditComplete && !formDirty && (
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

      <div className="w-full flex py-10">
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

        {/* UpdateButton */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          {(formDirty || updateState !== "initial") && (
            <UpdateButton
              state={updateState}
              onReset={handleReset}
              onSave={handleSubmit}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default EditProfileCard;
