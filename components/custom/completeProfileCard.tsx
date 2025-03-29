"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { User } from "@/store/userStore";
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Lightbulb,
  UserCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

type ProfileSection =
  | "profile"
  | "bio"
  | "education"
  | "skills"
  | "certifications"
  | "experience";

interface ProfileItem {
  id: ProfileSection;
  title: string;
  description: string;
  icon: React.ReactNode;
  check: (user: User) => boolean;
}

interface CompleteProfileCardProps {
  user: User | null;
  onEditClick: (section: ProfileSection) => void;
}

export default function CompleteProfileCard({
  user,
  onEditClick,
}: CompleteProfileCardProps) {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  const profileItems = useMemo<ProfileItem[]>(
    () => [
      {
        id: "profile",
        title: "Complete Your Basic Info",
        description: "Add your name, contact information, and profile picture",
        icon: <UserCircle className="h-8 w-8 text-primary" />,
        check: (user) =>
          !!(
            user?.skills &&
            user?.address &&
            user?.interests &&
            user?.experience
          ),
      },
      {
        id: "bio",
        title: "Add Your Bio",
        description: "Tell us about yourself and your professional background",
        icon: <UserCircle className="h-8 w-8 text-primary" />,
        check: (user) => !!user?.bio,
      },
      {
        id: "education",
        title: "Add Education History",
        description: "Include your degrees, schools, and graduation dates",
        icon: <GraduationCap className="h-8 w-8 text-primary" />,
        check: (user) =>
          !!(
            user?.education &&
            Array.isArray(user.education) &&
            user.education.length > 0
          ),
      },
      {
        id: "skills",
        title: "Add Your Skills",
        description: "Highlight your technical and professional skills",
        icon: <Lightbulb className="h-8 w-8 text-primary" />,
        check: (user) => !!user?.skills,
      },
      {
        id: "certifications",
        title: "Add Your Certifications",
        description: "Showcase your professional certifications",
        icon: <BookOpen className="h-8 w-8 text-primary" />,
        check: (user) =>
          !!(user?.certifications && user.certifications.length > 0),
      },
      {
        id: "experience",
        title: "Add Work Experience",
        description: "Include your employment history and achievements",
        icon: <Briefcase className="h-8 w-8 text-primary" />,
        check: (user) => !!user?.experience,
      },
    ],
    []
  );

  // Calculate profile completion percentage
  useEffect(() => {
    setMounted(true);
    if (user) {
      const completedItems = profileItems.filter((item) =>
        item.check(user)
      ).length;
      const totalItems = profileItems.length;
      setProgress(Math.round((completedItems / totalItems) * 100));
    }
  }, [user, profileItems]);

  // Only render client-side to avoid hydration mismatch with theme
  if (!mounted) return null;

  // Filter items that are not completed
  const incompleteItems = user
    ? profileItems.filter((item) => !item.check(user))
    : profileItems;

  // If everything is complete, don't show the component
  if (incompleteItems.length === 0) return null;

  return (
    <div className="mb-8">
      <Card className="border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/30 pb-6">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
                <div className="relative bg-black dark:bg-white text-white dark:text-black rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
                  {progress}%
                </div>
              </div>
              <span>Complete Your Profile</span>
            </CardTitle>
            <div className="flex items-center gap-1 text-sm font-medium text-primary">
              <span>
                {profileItems.length - incompleteItems.length}/
                {profileItems.length} completed
              </span>
              {progress === 100 && <CheckCircle2 className="h-4 w-4 ml-1" />}
            </div>
          </div>
          <CardDescription className="text-slate-700 dark:text-slate-300 text-base">
            Enhance your visibility to potential employers by completing your
            profile.
          </CardDescription>
          <div className="mt-4 relative">
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <Progress value={progress} className="h-full" />
            </div>
            <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Just started</span>
              <span>Halfway there</span>
              <span>Complete</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-slate-50 dark:bg-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {incompleteItems.map((item) => (
              <Card
                key={item.id}
                className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group rounded-lg overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                <CardHeader className="pb-2 pt-5">
                  <div className="flex justify-between items-start">
                    <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                      {item.icon}
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-primary transition-colors">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                        {profileItems.findIndex((i) => i.id === item.id) + 1}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold mt-3">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </CardContent>
                <CardFooter className="pb-5">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full group-hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    onClick={() => onEditClick(item.id)}
                  >
                    <span>Complete This Section</span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
