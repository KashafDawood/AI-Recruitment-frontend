import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { Toaster } from "sonner";
import { Aclonica, Pixelify_Sans } from "next/font/google";

const aclonica = Aclonica({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-aclonica",
  display: "swap",
});

const pixelify = Pixelify_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-pixelify",
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
      <body className={`${aclonica.variable} ${pixelify.variable}`}>
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
