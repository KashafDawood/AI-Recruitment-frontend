import Link from "next/link";
import { Globe, Mail, Pencil, Phone } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import OptimizeImage from "@/components/custom/optimizeImage";
import { User } from "@/store/userStore";
import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";

type ProfileCardProps = {
  user: User | null;
  onEditClick?: () => void;
};

export const EmpProfileCard: React.FC<ProfileCardProps> = ({
  user,
  onEditClick,
}) => {
  return (
    <Card className="relative">
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
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-[18rem] h-[18rem] border-6 border-gray-300 shadow-md rounded-full overflow-hidden">
            {user?.photo ? (
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
          </div>
          <h1 className="text-2xl font-bold mt-3">{user?.name}</h1>
          <p className="text-muted-foreground">@{user?.username}</p>
        </div>
      </CardContent>
      <CardHeader>
        <h2 className="text-xl font-semibold">Contact Information</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-start gap-3">
          <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Email</p>
            <Link
              href={`mailto:${user?.email}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {user?.email}
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap items-start gap-3">
          <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Phone</p>
            <Link href={`tel:${user?.phone}`} className="text-sm">
              {user?.phone}
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap items-start gap-3">
          <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Website</p>
            <Link
              href={user?.website || "#"}
              target="_blank"
              className="text-sm"
            >
              {user?.website}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
