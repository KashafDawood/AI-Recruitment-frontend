import HeroSection from "../components/home/HeroSection";
import About from "../components/home/About";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import Blogs from "../components/home/Blogs";
import Contact from "../components/home/Footer";
import { JSX } from "react";

export default function Home(): JSX.Element {
  return (
    <div>
      <HeroSection />
      <About />
      <Features />
      <Blogs />
      <HowItWorks />
      <Contact />
    </div>
  );
}
