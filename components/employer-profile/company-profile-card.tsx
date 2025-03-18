import Link from "next/link";
import { Building2, MapPin, Pencil, Users } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import OptimizeImage from "@/components/custom/optimizeImage";
import SocialIcon from "@/components/social-icon/social-icon";
import React from "react";
import { User } from "@/store/userStore";

interface CompanyProfileCardProps {
  user: User | null;
  onEditClick?: () => void;
}

export const CompanyProfileCard: React.FC<CompanyProfileCardProps> = ({
  user,
  onEditClick,
}) => {
  return (
    <Card className="relative dark:bg-gray-900">
      {onEditClick && (
        <Button
          onClick={onEditClick}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-20 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700"
          title="Edit Company Profile"
        >
          <Pencil size={18} />
        </Button>
      )}
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-md">
            <OptimizeImage
              className="rounded-full shadow-md"
              src={user?.logo}
              width={100}
              alt={user?.company_name || "company"}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.company_name}</h2>
            <p className="text-muted-foreground">{user?.industry}</p>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end space-x-2 mt-4 pr-16">
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
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">About the Company</h3>
          <p className="text-sm text-muted-foreground">
            {user?.about_company || "No company description available."}
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Industry</p>
              <p className="text-sm">{user?.industry}</p>
            </div>
          </div>
          {user?.company_size && (
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Company Size</p>
                <p className="text-sm">{user?.company_size}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm">{user?.address}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
