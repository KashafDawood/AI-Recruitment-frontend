import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { Toaster } from "sonner";
import { Fruktur } from "next/font/google";

const fruktur = Fruktur({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fruktur",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Staffee",
  description:
    "Staffee is an AI-powered recruitment and staffing platform targeting both candidates and recruiters, streamlining the hiring process with intelligent matching and efficient workflows.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fruktur.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
