import React from "react";
import { Users, Search, Mail, Filter, BarChart, FileText } from "lucide-react";
import Image from "next/image";
import { Button } from "../../components/ui/button";

const features = [
  { icon: <Search className="w-6 h-6 text-blue-600" />, title: "AI-Powered Candidate Matching", description: "Employers find the best talent instantly." },
  { icon: <Users className="w-6 h-6 text-green-600" />, title: "Smart Job Search", description: "Candidates get AI-recommended jobs." },
  { icon: <Mail className="w-6 h-6 text-purple-600" />, title: "Automated Contracts & Emails", description: "AI drafts hiring agreements & outreach." },
  { icon: <Filter className="w-6 h-6 text-yellow-600" />, title: "Advanced Filtering & Shortlisting", description: "AI ranks applicants for quick selection." },
  { icon: <BarChart className="w-6 h-6 text-red-600" />, title: "Real-Time Hiring Insights", description: "Track applications & job postings easily." },
  { icon: <FileText className="w-6 h-6 text-indigo-600" />, title: "AI-Powered Candidate Bio Generator", description: "Easily generate professional candidate bios using AI." },
];

const FeaturesShowcase = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-900">Why Choose Us?</h2>
        <p className="text-gray-600 text-lg mt-2">AI-powered recruitment that saves time and improves hiring quality.</p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 lg:px-20">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-transform transform hover:scale-105">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
            <p className="text-gray-700 mt-2">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mt-10">
        <Button>Get Started Today</Button>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
