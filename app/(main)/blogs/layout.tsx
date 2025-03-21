import FooterSection from "@/components/home/Footer";
import { HeroHeader } from "@/components/home/header";

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="pb-20">
        <HeroHeader />
      </header>
      <main>{children}</main>
      <FooterSection />
    </>
  );
}
