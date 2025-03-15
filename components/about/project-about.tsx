"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function ProjectAboutSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div className="relative">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-primary/10 dark:bg-primary/20"></div>
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/10 dark:bg-primary/20"></div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <DotLottieReact
                src="project.lottie"
                loop
                autoplay
                className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="mb-3 inline-block text-sm font-medium text-primary dark:text-primary-400">
              Final Year Project
            </span>
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              AI Recruitment Platform
            </h2>
            <p className="mt-4 text-muted-foreground">
              A modern recruitment platform leveraging AI to connect candidates
              and employers efficiently, designed to streamline the hiring
              process through innovative technology.
            </p>
            <p className="mt-4 text-muted-foreground">
              This project combines our knowledge of AI integration, Django,
              React, and cloud infrastructure to create a meaningful impact in
              the recruitment and hiring domain.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border p-6 transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-lightbulb"
              >
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Problem</h3>
            <p className="mt-2 text-muted-foreground">
              We identified inefficiencies in traditional recruitment processes
              that could be solved with AI-powered matching and recommendations.
            </p>
          </div>

          <div className="rounded-xl border p-6 transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-code"
              >
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Technology</h3>
            <p className="mt-2 text-muted-foreground">
              Built using Django, Django REST Framework, React, PostgreSQL, and
              OpenAI API, focusing on performance and user experience.
            </p>
          </div>

          <div className="rounded-xl border p-6 transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-target"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Impact</h3>
            <p className="mt-2 text-muted-foreground">
              Our solution aims to streamline the recruitment process by
              connecting ideal candidates with employers through AI-powered
              matching and recommendation systems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
