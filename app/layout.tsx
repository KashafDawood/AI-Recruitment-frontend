import type { Metadata } from "next";
import "./globals.css";
import TokenRefreshProvider from "@/lib/TokenRefreshProvider";
import { ThemeProvider } from "@/components/theme-provider";

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
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TokenRefreshProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
