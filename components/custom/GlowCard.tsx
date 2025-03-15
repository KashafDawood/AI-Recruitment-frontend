import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const vibrantColors = [
  "#FF5E5B", // Coral red
  "#00C2A8", // Turquoise
  "#4A7CFF", // Blue
  "#FFD166", // Yellow
  "#9B5DE5", // Purple
  "#00BBF9", // Cyan
  "#F15BB5", // Pink
  "#00F5D4", // Mint
  "#FF9770", // Orange
  "#01BAEF", // Sky blue
];

interface GlowCardProps {
  children: ReactNode;
  color: string;
  isAlternate?: boolean;
}

export function GlowCard({
  children,
  color,
  isAlternate = false,
}: GlowCardProps) {
  return (
    <div
      className={cn(
        "w-full",
        isAlternate ? "md:pr-8 md:pl-0" : "md:pl-8"
      )}
    >
      <div className="relative overflow-hidden rounded-lg">
        {/* Color strip on left side */}
        <div
          className="absolute left-0 top-0 w-1 h-full z-10"
          style={{ backgroundColor: color }}
        ></div>

        {/* Inner glow on right side */}
        <div
          className="absolute right-0 top-0 w-40 h-40"
          style={{
            background: `radial-gradient(circle at top right, ${color}30, transparent 100%)`,
            filter: "blur(10px)",
            transform: "translate(10%, -25%)",
          }}
        ></div>
        {children}
      </div>
    </div>
  );
}
