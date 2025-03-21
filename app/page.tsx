import HeroSection from "../components/home/HeroSection";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import Blogs from "../components/home/Blogs";
import { JSX } from "react";
import FooterSection from "@/components/home/Footer";
import GlowBackground from "@/components/custom/glowBackground";

export default function Home(): JSX.Element {
  return (
    <div>
      <HeroSection />
      <Features />
      <HowItWorks />
      <Blogs />
      <FooterSection />
      <GlowBackground />
    </div>
  );
}
