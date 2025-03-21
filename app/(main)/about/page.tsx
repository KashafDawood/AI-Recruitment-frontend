import ProjectAboutSection from "@/components/about/project-about";
import ContributorsSection from "@/components/about/contributors";
import GlowBackground from "@/components/custom/glowBackground";
import { TextEffect } from "@/components/motion-primitives/text-effect";

export default function Home() {
  return (
    <main>
      <div className="text-center sm:mx-auto mt-12 md:mt-16">
        <span className="text-foreground text-sm border rounded-full px-3 py-1">
          Our Mission
        </span>

        <div className="mt-8 text-balance text-4xl md:text-6xl lg:mt-8 font-black">
          <TextEffect
            preset="fade-in-blur"
            speedSegment={0.3}
            as="h1"
            className="inline"
          >
            About
          </TextEffect>{" "}
          <TextEffect
            preset="fade-in-blur"
            speedSegment={0.3}
            as="span"
            className="inline gradient-text"
          >
            Our Platform
          </TextEffect>
        </div>

        <TextEffect
          per="line"
          preset="fade-in-blur"
          speedSegment={0.3}
          delay={0.5}
          as="p"
          className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground"
        >
          Learn about our AI-powered recruitment platform that&apos;s
          transforming how companies hire talent. Discover our story, mission,
          and the team behind it all.
        </TextEffect>
      </div>
      <ProjectAboutSection />
      <ContributorsSection />
      <GlowBackground />
    </main>
  );
}
