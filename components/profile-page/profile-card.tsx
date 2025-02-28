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

type ProfileCardProps = {
  user: User | null;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <Card className="w-full h-auto rounded-b-none shadow-sm overflow-hidden border-0 flex items-center relative">
      {/* Background Overlay */}
      <div className="absolute top-[-15] inset-0 overflow-hidden">
        <CardBg name={user?.name} />
      </div>

      <div className="py-12 w-full relative z-10">
        <div className="flex flex-col md:flex-row justify-around items-center px-6 md:px-12">
          {/* Left Side: Role and Socials */}
          <div className="md:w-1/4 mb-6 md:mb-0 text-end">
            <p className="text-sm dark:text-gray-300 text-gray-700">Role</p>
            <p className="font-semibold text-xl">{user?.interests}</p>

            <div className="flex space-x-2 mt-4 float-end">
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
          <div className="mx-4">
            <div className="relative w-[10rem] h-[18rem] border-6 border-gray-300 shadow-md rounded-[6rem] overflow-hidden">
              {user?.photo ? (
                <OptimizeImage
                  src={user.photo}
                  alt={user?.name || "profile image"}
                  width={500}
                  height={900}
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
          </div>

          {/* Right Side: Experience and Skills */}
          <div className="md:w-1/4 mt-6 md:mt-0">
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
              <div className="flex flex-wrap gap-2">
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
