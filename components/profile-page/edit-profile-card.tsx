import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@/store/userStore";
import OptimizeImage from "../custom/optimizeImage";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import SocialIcon from "../social-icon/social-icon";
import { CardBg } from "./card-bg";
import { X, Plus, Check } from "lucide-react";

type ProfileCardProps = {
  user: User | null;
  onChange?: (file: File | null) => void;
};

const EditProfileCard: React.FC<ProfileCardProps> = ({ user, onChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    experience: user?.experience || "",
    interest: user?.interests || "",
    name: user?.name || "",
  });
  const [socials, setSocials] = useState<Record<string, string>>(
    user?.socials || {}
  );
  const [skills, setSkills] = useState<string[]>(
    Array.isArray(user?.skills) ? user?.skills : []
  );
  const [showSocialInput, setShowSocialInput] = useState(false);
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [newSocialData, setNewSocialData] = useState({ platform: "", url: "" });
  const [newSkill, setNewSkill] = useState("");
  const socialInputRef = useRef<HTMLDivElement>(null);
  const skillInputRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    if (onChange) {
      onChange(file);
    }
  };

  const handleAddSocialClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowSocialInput(true);
  };

  const handleSocialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSocialData((prev) => ({ ...prev, [name]: value }));

    // Only try to extract platform if the URL is valid
    if (value) {
      try {
        // Add https:// prefix if missing
        let urlValue = value;
        if (
          !urlValue.startsWith("http://") &&
          !urlValue.startsWith("https://")
        ) {
          urlValue = "https://" + urlValue;
        }

        const url = new URL(urlValue);
        const platform = url.hostname.replace("www.", "").split(".")[0];

        // Set the platform based on the hostname
        if (platform) {
          setNewSocialData((prev) => ({
            ...prev,
            platform: platform,
            url: value,
          }));
        }
      } catch {
        // If URL is invalid, just update the URL field without extracting platform
        setNewSocialData((prev) => ({ ...prev, url: value }));
      }
    }
  };

  const handleSocialSave = () => {
    let platformName = newSocialData.platform;
    let urlValue = newSocialData.url;

    // If URL is provided but platform is empty, try to extract platform
    if (urlValue && !platformName) {
      try {
        // Add https:// prefix if missing
        if (
          !urlValue.startsWith("http://") &&
          !urlValue.startsWith("https://")
        ) {
          urlValue = "https://" + urlValue;
        }

        const url = new URL(urlValue);
        platformName = url.hostname.replace("www.", "").split(".")[0];
      } catch {
        // If URL parsing fails, use a default platform name
        platformName = "website";
      }
    }

    if (urlValue) {
      setSocials((prev) => ({
        ...prev,
        [platformName.toLowerCase()]: urlValue,
      }));
      setNewSocialData({ platform: "", url: "" });
      setShowSocialInput(false);
    }
  };

  const handleCancelAdd = () => {
    setNewSocialData({ platform: "", url: "" });
    setShowSocialInput(false);
  };

  const handleDeleteSocial = (platform: string) => {
    // Delete after animation completes
    setTimeout(() => {
      const updatedSocials = { ...socials };
      delete updatedSocials[platform];
      setSocials(updatedSocials);
    }, 500);
  };

  // Skill management functions
  const handleAddSkillClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowSkillInput(true);
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSkill(e.target.value);
  };

  const handleSkillSave = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills((prev) => [...prev, newSkill]);
      setNewSkill("");
      setShowSkillInput(false);
    }
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSkillSave();
    }
  };

  const handleCancelSkillAdd = () => {
    setNewSkill("");
    setShowSkillInput(false);
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToDelete));
  };

  // Handle outside clicks for skill input
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showSkillInput &&
        skillInputRef.current &&
        !skillInputRef.current.contains(event.target as Node)
      ) {
        handleCancelSkillAdd();
      }
    }

    if (showSkillInput) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSkillInput]);

  //   handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showSocialInput &&
        socialInputRef.current &&
        !socialInputRef.current.contains(event.target as Node)
      ) {
        handleCancelAdd();
      }
    }

    if (showSocialInput) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSocialInput]);

  return (
    <Card className=" h-auto rounded-b-none shadow-sm overflow-hidden border-0 items-center relative">
      {/* Background Overlay */}
      <div className="absolute top-[-15] inset-0 overflow-hidden">
        <CardBg name={user?.name} />
      </div>

      <form className="w-full flex py-10">
        <div className="py-12 w-full relative z-10">
          <div className="flex flex-col lg:flex-row justify-around items-center px-6 lg:px-12">
            {/* Left Side: Role and Socials */}
            <div className="lg:w-1/4 mb-6 lg:mb-0 text-center lg:text-end">
              <p className="text-sm dark:text-gray-300 text-gray-700">
                Update Role
              </p>
              <p className="font-semibold text-xl">
                {
                  <input
                    name="interest"
                    className="bg-transparent inline-block border-b-2 border-black dark:border-white outline-none"
                    type="text"
                    value={formData.interest}
                    onChange={handleChange}
                  />
                }
              </p>

              <div className="flex flex-col items-center lg:items-end mt-4">
                <p className="text-sm dark:text-gray-300 text-gray-700 mb-2">
                  Socials
                </p>
                <div className="flex flex-wrap gap-y-2 justify-center lg:justify-end space-x-2">
                  {/* Add new social button */}
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-white dark:bg-slate-700"
                    title="Add social media"
                    onClick={handleAddSocialClick}
                  >
                    <Plus
                      size={18}
                      className="text-gray-700 dark:text-gray-200"
                    />
                  </Button>

                  {socials && typeof socials === "object"
                    ? Object.entries(socials)
                        .filter(([platform, url]) => platform && url)
                        .map(([platform, url]) => (
                          <div key={platform} className="relative group">
                            <Link
                              href={url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                size="icon"
                                variant="outline"
                                className={`rounded-full bg-white dark:bg-slate-700`}
                                title={
                                  platform.charAt(0).toUpperCase() +
                                  platform.slice(1)
                                }
                              >
                                <SocialIcon
                                  platform={platform}
                                  size={18}
                                  className="text-gray-700 dark:text-gray-200"
                                />
                              </Button>
                            </Link>
                            {/* Delete button */}
                            <button
                              type="button"
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDeleteSocial(platform)}
                              title="Delete social"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))
                    : null}
                </div>

                {/* Social Input Form */}
                {showSocialInput && (
                  <div
                    ref={socialInputRef}
                    className="mt-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md w-full lg:w-64 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">
                          URL
                        </label>
                        <input
                          type="text"
                          name="url"
                          placeholder="https://"
                          value={newSocialData.url}
                          onChange={handleSocialInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div className="flex justify-between pt-2">
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={handleSocialSave}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check size={16} className="mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center: Profile Image */}
            <div className="relative mx-4 my-6 lg:my-0">
              <div className="w-[18rem] h-[18rem] border-6 border-gray-300 shadow-md rounded-full overflow-hidden">
                {preview ? (
                  <Image src={preview} alt="image" width={500} height={500} />
                ) : user?.photo ? (
                  <OptimizeImage
                    src={user.photo}
                    alt={user?.name || "profile image"}
                    width={500}
                  />
                ) : (
                  <Image
                    src={"/default-avatar.png"}
                    width={500}
                    height={500}
                    alt="default profile image"
                    className="object-cover w-full h-full bg-white dark:bg-gray-800"
                  />
                )}
                {/* pencil icon */}
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-5 right-10 transform translate-x-1/4 translate-y-1/4
              bg-white p-2 rounded-full border border-gray-300 cursor-pointer shadow"
                  title="Edit photo"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </label>
                {/* Hidden File Input */}
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleChangeFile}
                  className="hidden"
                />
              </div>
            </div>
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
              <div>
                <p className="text-sm dark:text-gray-300 text-gray-700">
                  Update Experience
                </p>
                <p className="font-semibold text-xl ">
                  {
                    <input
                      name="experience"
                      className="appearance-none bg-transparent inline-block w-6 border-b-2 border-black dark:border-white outline-none"
                      type="number"
                      value={formData.experience}
                      onChange={handleChange}
                    />
                  }{" "}
                  years
                </p>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm dark:text-gray-300 text-gray-700">
                    Skills
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full dark:bg-gray-700 bg-white border-none"
                    title="Add skill"
                    onClick={handleAddSkillClick}
                  >
                    <Plus size={14} className="mr-1" />
                    Add Skill
                  </Button>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {skills.map((skill) => (
                    <div key={skill} className="relative group">
                      <Badge className="bg-white text-gray-800 hover:bg-gray-100 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:border-gray-600 rounded-full py-1 px-3 border-0 dark:border-0">
                        {skill}
                        <button
                          type="button"
                          className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                          onClick={() => handleDeleteSkill(skill)}
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Skill Input Form */}
                {showSkillInput && (
                  <div
                    ref={skillInputRef}
                    className="mt-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                  >
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">
                          New Skill
                        </label>
                        <input
                          type="text"
                          value={newSkill}
                          onChange={handleSkillInputChange}
                          onKeyPress={handleSkillKeyPress}
                          placeholder="Enter skill"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          autoFocus
                        />
                      </div>
                      <div className="flex justify-between pt-2">
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={handleSkillSave}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check size={16} className="mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default EditProfileCard;
