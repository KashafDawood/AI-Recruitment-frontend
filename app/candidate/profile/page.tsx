"use client";

import { useUserWithLoading } from "@/hooks/useUser";
import Spinner from "@/components/ui/spinner";
import ProfileCard from "@/components/profile-page/profile-card";

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
    </>
  );
}
