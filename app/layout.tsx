import type { Metadata } from "next";
import "./globals.css";
import useTokenRefresh from "@/api/auth/refreshtoken";

export const metadata: Metadata = {
  title: "Staffee",
  description:
    "Staffee is an AI-powered recruitment and staffing platform targeting both candidates and recruiters, streamlining the hiring process with intelligent matching and efficient workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useTokenRefresh();
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
