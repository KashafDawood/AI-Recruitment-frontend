import { UserRound, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  return (
    <section className="flex justify-center py-16 md:py-24 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Our platform connects talented professionals with great companies
            through a simple, streamlined process.
          </p>
        </div>

        {/* Mobile view (vertical) */}
        <div className="md:hidden space-y-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white dark:bg-zinc-800/50 rounded-xl p-6 shadow-lg border border-zinc-200 dark:border-zinc-700/50 transition-transform hover:-translate-y-1 duration-300"
            >
              <div className="absolute -top-4 -left-2 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {index + 1}
              </div>

              <h3 className="text-xl font-semibold mb-4 mt-2">{step.title}</h3>

              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-sm">
                    <UserRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Candidate
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      {step.candidate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shadow-sm">
                    <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      Recruiter
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      {step.recruiter}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop view (horizontal) */}
        <div className="hidden md:block relative max-w-6xl mx-auto">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 -translate-y-1/2 z-0 rounded-full shadow-sm"></div>

          <div className="grid grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step number */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl z-20 shadow-lg transform transition-transform hover:scale-110 duration-300">
                  {index + 1}
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 pt-10 shadow-lg border border-zinc-200 dark:border-zinc-700/50 mt-7 relative transform transition-all hover:-translate-y-1 hover:shadow-xl duration-300">
                  <h3 className="text-xl font-semibold mb-5 text-center">
                    {step.title}
                  </h3>

                  <div className="grid gap-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-sm">
                        <UserRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          Candidate
                        </h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                          {step.candidate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shadow-sm">
                        <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          Recruiter
                        </h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                          {step.recruiter}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow to next step (except last step) */}
                {index < steps.length - 1 && (
                  <div className="absolute top-1/2 -right-8 -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-zinc-400 dark:text-zinc-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-6">
            <Link href={"/signup"}>
              <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 text-white font-semibold shadow-md hover:shadow-lg transition-shadow duration-300">
                Ready to get started?
              </div>
            </Link>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
            Join thousands of professionals and companies who have already found
            their perfect match on our platform.
          </p>
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    title: "Sign Up",
    candidate:
      "Create your candidate account in seconds and join our community of professionals.",
    recruiter:
      "Register as a recruiter to access our pool of qualified candidates.",
  },
  {
    title: "Complete Your Profile",
    candidate:
      "Showcase your skills, experience, and career goals to increase your chances of getting noticed.",
    recruiter:
      "Build your company profile highlighting culture, benefits, and what makes your workplace special.",
  },
  {
    title: "Take Action",
    candidate:
      "Browse job listings tailored to your skills and apply with a single click.",
    recruiter:
      "Post job openings, review applications, and connect with promising candidates.",
  },
];
