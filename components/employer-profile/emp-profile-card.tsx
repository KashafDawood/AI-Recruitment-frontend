import Link from "next/link";
import { Globe, Mail, Phone } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import OptimizeImage from "@/components/custom/optimizeImage";
import { User } from "@/store/userStore";
import React from "react";

export const EmpProfileCard: React.FC<{ user: User | null }> = ({ user }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <OptimizeImage
            className="rounded-full shadow-md"
            src={user?.photo || "/default.png"}
            width={300}
            alt={user?.name || "employer"}
          />
          <h1 className="text-2xl font-bold">{user?.name}</h1>
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
