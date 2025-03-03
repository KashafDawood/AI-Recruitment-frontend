import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@/store/userStore";
import OptimizeImage from "../custom/optimizeImage";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import SocialIcon from "../social-icon/social-icon";
import { CardBg } from "./card-bg";
import { X, Plus } from "lucide-react"; // Import icons

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

  const handleDeleteSocial = (platform: string) => {
    // Delete after animation completes
    setTimeout(() => {
      const updatedSocials = { ...socials };
      delete updatedSocials[platform];
      setSocials(updatedSocials);
    }, 500);
  };

  const handleAddSocial = () => {
    // You could implement a modal or form to add a new social
    console.log("Add new social clicked");
    // Example implementation - add a placeholder that can be edited
    setSocials((prev) => ({ ...prev, newplatform: "https://" }));
  };

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

              <div className="flex justify-center lg:justify-end space-x-2 mt-4">
                {/* Add new social button */}
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full bg-white dark:bg-slate-700"
                  title="Add social media"
                  onClick={handleAddSocial}
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
                <p className="text-sm dark:text-gray-300 text-gray-700 mb-2">
                  Skills
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {user?.skills && Array.isArray(user.skills)
                    ? user.skills.map((skill) => (
                        <Badge
                          key={skill}
                          className="bg-white text-gray-800 hover:bg-gray-100 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:border-gray-600 rounded-full py-1 px-3 border-0 dark:border-0"
                        >
                          {skill}
                        </Badge>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default EditProfileCard;
