"use client";

import { Briefcase, BookmarkCheck, CheckCircle } from "lucide-react";

export const navItems = [
  {
    title: "Find Job",
    url: "/candidate/jobs",
    icon: Briefcase,
  },
  {
    title: "Saved Jobs",
    url: "/candidate/savedjobs",
    icon: BookmarkCheck,
  },
  {
    title: "Applied Jobs",
    url: "/candidate/appliedjobs",
    icon: CheckCircle,
  },
];
