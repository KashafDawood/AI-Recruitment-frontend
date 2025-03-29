"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { User } from "@/store/userStore";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProfileCompletionAlertProps {
  user: User | null;
  className?: string;
}

export default function ProfileCompletionAlert({
  user,
  className,
}: ProfileCompletionAlertProps) {
  const [profileCompletion, setProfileCompletion] = useState(0);
  const router = useRouter();

  // Calculate profile completion percentage
  useEffect(() => {
    if (user) {
      let completedSections = 0;
      const totalSections = 6; // profile, bio, education, skills, certifications, experience

      // Check if basic profile info is complete
      if (user.skills && user.address && user.interests && user.experience) {
        completedSections++;
      }

      // Check if bio is complete
      if (user.bio) {
        completedSections++;
      }

      // Check if education is complete
      if (
        user.education &&
        Array.isArray(user.education) &&
        user.education.length > 0
      ) {
        completedSections++;
      }

      // Check if skills are added
      if (user.skills) {
        completedSections++;
      }

      // Check if certifications are added
      if (user.certifications && user.certifications.length > 0) {
        completedSections++;
      }

      // Check if experience is added
      if (user.experience) {
        completedSections++;
      }

      setProfileCompletion(
        Math.round((completedSections / totalSections) * 100)
      );
    }
  }, [user]);

  const navigateToProfile = () => {
    router.push("/candidate/profile");
  };

  const isProfileComplete = profileCompletion === 100;

  // Don't render anything if the profile is complete
  if (isProfileComplete || !user) {
    return null;
  }

  return (
    <Alert
      className={`border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950 text-orange-800 dark:text-orange-300 ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <div>
            <AlertTitle className="font-semibold text-orange-800 dark:text-orange-300">
              Complete your profile
            </AlertTitle>
            <AlertDescription className="text-orange-700 dark:text-orange-400 mt-1">
              Your profile is only {profileCompletion}% complete. Complete your
              profile to increase your chances of getting hired.
            </AlertDescription>
            <div className="mt-2 mb-3 md:mb-0">
              <Progress
                value={profileCompletion}
                className="h-2 bg-orange-200 dark:bg-orange-900"
              />
            </div>
          </div>
        </div>
        <Button
          onClick={navigateToProfile}
          className="bg-orange-600 hover:bg-orange-700 text-white ml-0 md:ml-4 flex items-center gap-2 transition-all"
        >
          <span>Complete Profile</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}
