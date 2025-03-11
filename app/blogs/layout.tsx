import Footer from "@/components/home/Contact";
import { NavMenu } from "@/components/home/navbar";

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>
        <NavMenu />
      </header>
      <main>{children}</main>
      <Footer />
    </>
  );
}
