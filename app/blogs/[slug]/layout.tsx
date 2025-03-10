import Footer from "@/components/home/Contact";
import { NavMenu } from "@/components/home/navbar";

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <NavMenu />
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        {children}
      </main>
      <Footer />
    </div>
  );
}
