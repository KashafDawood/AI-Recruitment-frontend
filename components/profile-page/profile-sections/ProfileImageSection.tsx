import React from "react";
import Image from "next/image";
import OptimizeImage from "../../custom/optimizeImage";
import { User } from "@/store/userStore";

type ProfileImageSectionProps = {
  user: User | null;
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
  user,
  preview,
  onChange,
}) => {
  return (
    <div className="relative mx-4 my-6 lg:my-0">
      <div className="w-[18rem] h-[18rem] border-6 border-gray-300 shadow-md rounded-full overflow-hidden">
        {preview ? (
          <Image
            className="object-cover w-full h-full"
            src={preview}
            alt="image"
            width={500}
            height={500}
          />
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

        {/* Edit icon */}
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
          onChange={onChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ProfileImageSection;
