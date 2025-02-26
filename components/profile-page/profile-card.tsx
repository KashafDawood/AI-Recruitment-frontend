import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { User } from "@/store/userStore";
import { Avatar } from "@/components/ui/avatar";
import OptimizeImage from "../optimizeImage";

type ProfileCardProps = {
  user: User | null;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <Card className="w-full h-[500px] bg-slate-200 dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border-0 flex items-center">
      <div className="p-6 w-full">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center w-full md:w-[50%] relative">
            <div className="relative">
              {/* This would be an actual image in production */}
              <div className="w-full h-full rounded-full border-white">
                <Avatar className="relative w-[18rem] h-auto border-6 border-gray-300 shadow-md rounded-full">
                  <OptimizeImage
                    src={user?.photo}
                    alt={user?.name || "image"}
                    width={500}
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
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-white"
                  >
                    <span className="font-bold">@</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-white"
                  >
                    <span className="font-bold">X</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-white"
                  >
                    <span className="font-bold">in</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-white"
                  >
                    <span className="font-bold">☞</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-semibold text-xl">{user?.interests}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-semibold text-xl">
                  {user?.experience} years
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-2">Skills</p>
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
