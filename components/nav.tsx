"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import ThemeToggle from "./dark-mode";
import { Button } from "./ui/button";

function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((path) => path);

  return (
    <div className="text-sm text-gray-500">
      <Link href="/" className="hover:text-blue-600">
        Home
      </Link>
      {paths.map((path, index) => (
        <span key={path}>
          <span className="mx-2">/</span>
          <Link
            href={`/${paths.slice(0, index + 1).join("/")}`}
            className="capitalize hover:text-blue-600"
          >
            {path}
          </Link>
        </span>
      ))}
    </div>
  );
}

export function NavMenu() {
  const pathname = usePathname();
  const pageTitle = pathname.split("/").pop() || "Dashboard";

  return (
    <nav className="bg-white dark:bg-gray-700 px-6 py-3 shadow-md rounded-xl w-full">
      <div className="flex items-center justify-between">
        {/* Left Section: Logo & Dynamic Title */}
        <div className="flex items-center gap-6">
          <Link href="/candidate">
            <Image src="/StaffeeLogo.svg" alt="Logo" width={25} height={25} />
          </Link>
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold capitalize">{pageTitle}</h1>
            <Breadcrumbs />
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="hidden md:flex gap-4">
          <Link
            href="/blogs"
            className="text-lg text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition"
          >
            Blogs
          </Link>
          <Link
            href="/about"
            className="text-lg text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition"
          >
            About us
          </Link>
          <Link
            href="/contact"
            className="text-lg text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition"
          >
            Contact us
          </Link>
        </div>

        {/* Right Section: Icons & Profile */}
        <div className="flex items-center">
          <ThemeToggle className="hidden md:flex" />

          <div className="hidden md:flex items-center"></div>
          <Link href="/login">
            <Button variant="link" size="lg">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="default"
              size="lg"
              className="bg-green-500 hover:bg-green-400 dark:bg-green-400 dark:hover:bg-green-300 text-white"
            >
              Get Started
            </Button>
          </Link>
          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger className="md:hidden">
              <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 mt-6">
                <Link
                  href="/blogs"
                  className="text-lg text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition"
                >
                  Blogs
                </Link>
                <Link
                  href="/about"
                  className="text-lg text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition"
                >
                  About us
                </Link>
                <Link
                  href="/contact"
                  className="text-lg text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition"
                >
                  Contact us
                </Link>
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
