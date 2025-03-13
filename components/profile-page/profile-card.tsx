import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@/store/userStore";
import OptimizeImage from "../custom/optimizeImage";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import SocialIcon from "../social-icon/social-icon";
import { CardBg } from "./card-bg";
import { Pencil } from "lucide-react";

type ProfileCardProps = {
  user: User | null;
  onEditClick?: () => void;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onEditClick }) => {
  return (
    <Card className="w-full h-auto rounded-b-none shadow-sm overflow-hidden border-0 flex items-center relative">
      {/* Background Overlay */}
      <div className="absolute top-[-15] inset-0 overflow-hidden">
        <CardBg name={user?.name} />
      </div>

      {/* Edit Button */}
      {onEditClick && (
        <Button
          onClick={onEditClick}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-20 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700"
          title="Edit Profile"
        >
          <Pencil size={18} />
        </Button>
      )}

      <div className="py-12 w-full relative z-10">
        <div className="flex flex-col lg:flex-row justify-around items-center px-6 lg:px-12">
          {/* Left Side: Role and Socials */}
          <div className="lg:w-1/4 mb-6 lg:mb-0 text-center lg:text-end">
            <p className="text-sm dark:text-gray-300 text-gray-700">Role</p>
            <p className="font-semibold text-xl">{user?.interests}</p>

            <div className="flex justify-center lg:justify-end space-x-2 mt-4">
              {user?.socials && typeof user.socials === "object"
                ? Object.entries(user.socials)
                    .filter(([platform, url]) => platform && url)
                    .map(([platform, url]) => (
                      <Link
                        href={url || "#"}
                        key={platform}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full bg-white dark:bg-slate-700"
                          title={
                            platform.charAt(0).toUpperCase() + platform.slice(1)
                          }
                        >
                          <SocialIcon
                            platform={platform}
                            size={18}
                            className="text-gray-700 dark:text-gray-200"
                          />
                        </Button>
                      </Link>
                    ))
                : null}
            </div>
          </div>

          {/* Center: Profile Image */}
          <div className="mx-4 my-6 lg:my-0">
            <div className="relative w-[18rem] h-[18rem] border-6 border-gray-300 shadow-md rounded-full overflow-hidden">
              {user?.photo ? (
                <OptimizeImage
                  src={user.photo}
                  alt={user?.name || "profile image"}
                  width={500}
                  className="object-cover w-full h-full"
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
            </div>
            {/* <h1 className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center text-4xl font-vertigo w-full">
              {user?.name}
            </h1> */}
          </div>

          {/* Right Side: Experience and Skills */}
          <div className="lg:w-1/4 mt-6 lg:mt-0 text-center lg:text-start">
            <div>
              <p className="text-sm dark:text-gray-300 text-gray-700">
                Experience
              </p>
              <p className="font-semibold text-xl">{user?.experience} years</p>
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
    </Card>
  );
};

export default ProfileCard;
