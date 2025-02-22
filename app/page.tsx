import HeroSection from "@/home/HeroSection";
import About from "@/home/About";
import Features from "@/home/Features";
import HowItWorks from "@/home/HowItWorks";
import Contact from "@/home/Contact";

export default function Home(): JSX.Element {
  return (
    <div>
      <HeroSection />
      <About />
      <Features />
      <HowItWorks />
      <Contact />
    </div>
  );
}