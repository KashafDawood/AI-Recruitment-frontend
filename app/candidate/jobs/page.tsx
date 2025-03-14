"use client";

import { GlowCard, vibrantColors } from "@/components/custom/GlowCard";

export default function FindJobs() {
  const educationWithColors = educationArray.map((edu, index) => ({
    ...edu,
    color: vibrantColors[index % vibrantColors.length],
  }));
  return (
    <>
      <h1>Find Jobs</h1>

      <GlowCard>
        <h1>Software Engineering</h1>
        <p>lsdkjflskdjlfkjsldkfjlskdfjlsdf</p>
      </GlowCard>
    </>
  );
}
