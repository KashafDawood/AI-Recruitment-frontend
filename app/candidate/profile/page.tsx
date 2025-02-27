"use client";

import { useUserWithLoading } from "@/hooks/useUser";
import Spinner from "@/components/ui/spinner";
import ProfileCard from "@/components/profile-page/profile-card";
import DOMPurify from "dompurify";
import EducationTimeline from "@/components/profile-page/eduaction-card";

export default function CandidateProfile() {
  const { user, isLoading } = useUserWithLoading();

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <ProfileCard user={user} />
      <div className="bg-slate-200 dark:bg-slate-800 text-black dark:text-white shadow p-6 rounded-b-xl">
        <h1 className="text-2xl font-semibold mb-4">My Story</h1>
        {user?.bio && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(user?.bio) }}
          />
        )}
        {user?.education && (
          <EducationTimeline educationData={user?.education} />
        )}
      </div>
    </>
  );
}
