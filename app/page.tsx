import HeroSection from "../components/home/HeroSection";
import About from "../components/home/About";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import Contact from "../components/home/Contact";
import { JSX } from "react";
import { NavMenu } from "@/components/home/navbar";

export default function Home(): JSX.Element {
  return (
    <div>
      <NavMenu />
      <HeroSection />
      <About />
      <Features />
      <HowItWorks />
      <Contact />
    </div>
  );
}
