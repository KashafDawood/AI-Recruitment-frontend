export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <nav className="mb-8">{/* Add employer navigation here */}</nav>
      <main>{children}</main>
    </div>
  );
}
