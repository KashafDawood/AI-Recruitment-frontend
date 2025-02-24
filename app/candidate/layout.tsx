import ThemeToggle from "@/components/dark-mode";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <nav className="mb-8 flex justify-between items-center">
        <div>{/* Add candidate navigation here */}</div>
        <ThemeToggle />
      </nav>
      <main>{children}</main>
    </div>
  );
}
