"use client";

import { PlusCircle, LayoutList, ListMinus } from "lucide-react";

export const navItems = [
  {
    title: "Create Job",
    url: "/employer/create-job",
    icon: PlusCircle,
  },
  {
    title: "My Job Listings",
    url: "/employer/my-joblistings",
    icon: LayoutList,
  },
  {
    title: "Create a Blog",
    url: "/employer/create-blog",
    icon: PlusCircle,
  },
  {
    title: "Blogs",
    url: "/employer/blogs",
    icon: ListMinus,
  },
];
