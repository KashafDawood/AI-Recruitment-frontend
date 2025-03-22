"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserByUsername } from "@/api/user/getUserbyUsername";
import ProfileCard from "@/components/profile-page/profile-card";
import EducationTimeline from "@/components/profile-page/education-card";
import ProfileBio from "@/components/profile-page/Bio";
import Certifications from "@/components/profile-page/certifications";
import { EmpProfileCard } from "@/components/employer-profile/emp-profile-card";
import { CompanyProfileCard } from "@/components/employer-profile/company-profile-card";
import { OpeningsCard } from "@/components/employer-profile/openings-card";
import Spinner from "@/components/ui/spinner";
import { User } from "@/store/userStore";

export default function UserProfile() {
  const params = useParams();
  const username = params.username as string;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserByUsername(username);
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchUser();
    }
  }, [username]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="p-6 bg-red-100 dark:bg-red-900 rounded-lg text-red-800 dark:text-red-200">
          {error || "User not found"}
        </div>
      </div>
    );
  }

  // Candidate profile view
  if (user.role === "candidate") {
    return (
      <div className="flex flex-col overflow-hidden">
        <ProfileCard user={user} />
        <div className="bg-slate-200 dark:bg-slate-800 text-black dark:text-white shadow p-6 rounded-b-xl">
          <ProfileBio bio={user?.bio || ""} />

          <EducationTimeline educationData={user?.education} />

          {user?.certifications && (
            <Certifications certifications={user.certifications} />
          )}
        </div>
      </div>
    );
  }

  // Employer profile view
  if (user.role === "employer") {
    return (
      <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-3 h-full">
        <EmpProfileCard user={user} />
        <div className="lg:col-span-2 space-y-6">
          <CompanyProfileCard user={user} />
          <OpeningsCard user={user} />
        </div>
      </div>
    );
  }

  // Fallback for unknown role
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-yellow-800 dark:text-yellow-200">
        Unknown user role: {user.role}
      </div>
    </div>
  );
}
