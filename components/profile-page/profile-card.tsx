import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { User } from "@/store/userStore";
import { Avatar } from "@/components/ui/avatar";
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
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center w-full md:w-[50%] relative">
            <div className="relative">
              {/* This would be an actual image in production */}
              <div className="w-full h-full rounded-full border-white">
                <Avatar className="relative w-[18rem] h-[18rem] border-6 border-gray-300 shadow-md rounded-full overflow-hidden">
                  {user?.photo && (
                    <OptimizeImage
                      src={user?.photo}
                      alt={user?.name || "image"}
                      width={500}
                    />
                  )}
                  <Image
                    src={"/default-avatar.png"}
                    width={500}
                    height={500}
                    alt="default image"
                    className="rounded-full object-cover w-full h-full bg-white dark:bg-gray-800"
                  />
                </Avatar>
              </div>
            </div>

            <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <Badge className="w-auto justify-center py-2 dark:bg-green-100 dark:hover:bg-green-100 bg-green-100 hover:bg-green-100 text-green-800 dark:text-green-800 rounded-full font-medium whitespace-nowrap border-0 dark:border-0">
                <CheckCircle className="h-4 w-4 mr-1" />{" "}
                {user?.role === "candidate" ? "Looking for Work" : "Hiring"}
              </Badge>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="flex-1 w-full max-w-[500px] md:w-[50%]">
            <div className="flex justify-between items-start">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-100">
                  {user?.name}
                </h2>

                <div className="flex space-x-2">
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
                        ))
                    : null}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm dark:text-gray-300 text-gray-700">Role</p>
                <p className="font-semibold text-xl">{user?.interests}</p>
              </div>
              <div>
                <p className="text-sm dark:text-gray-300 text-gray-700">
                  Experience
                </p>
                <p className="font-semibold text-xl">
                  {user?.experience} years
                </p>
              </div>
            </div>

            <div className="mt-6">
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
