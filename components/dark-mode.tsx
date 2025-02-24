"use client";

import { LayoutGrid, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex w-[100px] h-10 items-center justify-between rounded-full bg-neutral-900 p-1">
      <button
        onClick={() => setTheme("system")}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          theme === "system"
            ? "bg-neutral-700 text-white"
            : "text-neutral-400 hover:text-neutral-200"
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="sr-only">System theme</span>
      </button>
      <button
        onClick={() => setTheme("light")}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          theme === "light"
            ? "bg-neutral-700 text-white"
            : "text-neutral-400 hover:text-neutral-200"
        }`}
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Light theme</span>
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          theme === "dark"
            ? "bg-neutral-700 text-white"
            : "text-neutral-400 hover:text-neutral-200"
        }`}
      >
        <Moon className="h-4 w-4" />
        <span className="sr-only">Dark theme</span>
      </button>
    </div>
  );
}
