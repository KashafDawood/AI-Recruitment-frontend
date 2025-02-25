"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRightIcon, HomeIcon, MoreHorizontalIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BreadcrumbBlockProps {
  homeHref?: string;
  homeName?: string;
}

export function Breadcrumbs({
  homeHref = "/",
  homeName = "Home",
}: BreadcrumbBlockProps) {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  // Function to generate href for each breadcrumb item
  const getHref = (index: number) => `/${paths.slice(0, index + 1).join("/")}`;

  // Function to format the breadcrumb name
  const formatName = (name: string) =>
    name.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={homeHref} className="flex items-center">
            <HomeIcon className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{homeName}</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden sm:inline-block pt-0.5">
          <ChevronRightIcon className="h-4 w-4" />
        </BreadcrumbSeparator>
        {paths.length > 0 && (
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center sm:hidden">
                <MoreHorizontalIcon className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {paths.map((path, index) => (
                  <DropdownMenuItem key={path}>
                    <Link href={getHref(index)} className="flex w-full">
                      {formatName(path)}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
        )}
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;
          return (
            <React.Fragment key={path}>
              <BreadcrumbItem className="hidden sm:inline-flex">
                {isLast ? (
                  <BreadcrumbPage>{formatName(path)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={getHref(index)}>
                    {formatName(path)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className="hidden sm:inline-block pt-0.5">
                  <ChevronRightIcon className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
