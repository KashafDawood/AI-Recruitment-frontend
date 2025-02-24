export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <main>{children}</main>
    </div>
  );
}
