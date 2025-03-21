import ProjectAboutSection from "@/components/about/project-about";
import ContributorsSection from "@/components/about/contributors";

export default function Home() {
  return (
    <main>
      <h1 className="text-3xl font-bold text-center mt-20">
        About AI Recruitment
      </h1>
      <ProjectAboutSection />
      <ContributorsSection />
    </main>
  );
}
