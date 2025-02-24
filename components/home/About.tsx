import React from "react";
import { Briefcase, Search, UserCheck } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

const About: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      {/* Candidate Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 mb-16">
        {/* Left: Candidate Details */}
        <div className="lg:w-1/2 ml-14">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Dream Job, Just a Click Away!
          </h2>
          <p className="text-gray-700 text-lg mb-6">
            Find your dream job faster with AI-driven job matching. Get
            personalized recommendations and streamline your job search.
          </p>

          {/* Features */}
          <ul className="space-y-4">
            <li className="flex items-center text-gray-800">
              <Search className="w-6 h-6 text-blue-600 mr-2" />
              <span>AI-Powered Job Matching</span>
            </li>
            <li className="flex items-center text-gray-800">
              <UserCheck className="w-6 h-6 text-green-600 mr-2" />
              <span>Smart Resume Analysis</span>
            </li>
            <li className="flex items-center text-gray-800">
              <Briefcase className="w-6 h-6 text-purple-600 mr-2" />
              <span>Direct Employer Connections</span>
            </li>
          </ul>
          <Button>Find Your Job Now</Button>
        </div>

        {/* Right: Candidate Image */}
        <div className="lg:w-1/2 flex justify-center">
          <Image
            src="/candidate.png"
            alt="Candidate exploring job opportunities"
            width={400}
            height={400}
            priority
          />
        </div>
      </div>

      {/* Employer Section */}
      <div className="flex flex-col lg:flex-row-reverse items-center justify-between px-6">
        {/* Left: Employer Details */}
        <div className="lg:w-1/2">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Hire Smarter, Faster, and Better with AI!
          </h2>
          <p className="text-gray-700 text-lg mb-6">
            Simplify your hiring process with AI. Find top talent quickly and
            efficiently with automated screening and smart recommendations.
          </p>

          {/* Features */}
          <ul className="space-y-4">
            <li className="flex items-center text-gray-800">
              <Search className="w-6 h-6 text-blue-600 mr-2" />
              <span>AI-Driven Candidate Screening</span>
            </li>
            <li className="flex items-center text-gray-800">
              <UserCheck className="w-6 h-6 text-green-600 mr-2" />
              <span>Bias-Free Hiring</span>
            </li>
            <li className="flex items-center text-gray-800">
              <Briefcase className="w-6 h-6 text-purple-600 mr-2" />
              <span>Faster Onboarding Process</span>
            </li>
          </ul>
          <Button>Start Hiring Today</Button>
        </div>

        {/* Right: Employer Image */}
        <div className="lg:w-1/2 flex justify-center">
          <Image
            src="/employer.png"
            alt="Employer reviewing job candidates"
            width={400}
            height={400}
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default About;
