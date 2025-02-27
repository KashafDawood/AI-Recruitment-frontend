"use client";

import { useUserWithLoading } from "@/hooks/useUser";
import Spinner from "@/components/ui/spinner";
import ProfileCard from "@/components/profile-page/profile-card";
import DOMPurify from "dompurify";

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
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl text-black font-semibold mb-4">My Story</h1>
        {user?.bio && (
          <div
            className="prose max-w-none text-black"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(user?.bio) }}
          />
        )}
      </div>
    </>
  );
}
