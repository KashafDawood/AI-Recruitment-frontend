"use client";

import { useUserWithLoading } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileCard from "@/components/profile-page/profile-card";
import EducationTimeline from "@/components/profile-page/eduaction-card";
import ProfileBio from "@/components/profile-page/Bio";

export default function CandidateProfile() {
  const { user, isLoading } = useUserWithLoading();

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        {/* Profile Card Skeleton */}
        <div className="rounded-t-xl overflow-hidden">
          <Skeleton className="h-40 w-full" /> {/* Banner */}
          <div className="bg-white dark:bg-slate-900 p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" /> {/* Avatar */}
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" /> {/* Name */}
                <Skeleton className="h-4 w-72" /> {/* Title */}
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" /> {/* Details */}
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>

        {/* Bio Section Skeleton */}
        <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-b-xl">
          <Skeleton className="h-8 w-40 mb-6" /> {/* Section Title */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" /> {/* Bio paragraph */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          {/* Education Timeline Skeleton */}
          <div className="mt-8">
            <Skeleton className="h-8 w-32 mb-4" /> {/* Education Title */}
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                  <div className="space-y-2 flex-grow">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileCard user={user} />
      <div className="bg-slate-200 dark:bg-slate-800 text-black dark:text-white shadow p-6 rounded-b-xl">
        {user?.bio && <ProfileBio bio={user.bio} />}
        {user?.education && (
          <EducationTimeline educationData={user?.education} />
        )}
      </div>
    </>
  );
}
