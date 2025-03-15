"use client";

import { getAllJobs } from "@/api/candidate/getAllJobs";
import { GlowCard, vibrantColors } from "@/components/custom/GlowCard";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { ExternalLinkIcon } from "lucide-react";

interface Job {
  title: string;
  status: string;
  salary?: string;
  location: string;
  company: string;
  description: string;
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  return truncated.substring(0, truncated.lastIndexOf(" ")) + "...";
};

export default function FindJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getAllJobs();
        // Reverse the jobs array to show the latest jobs first
        jobs.reverse();
        console.log(jobs);
        setJobs(jobs);
      } catch (error) {
        console.error(error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {jobs.map((job, index) => {
        const sanitizedDescription = DOMPurify.sanitize(
          truncateText(job.description, 100)
        );
        return (
          <div key={index} className="p-4">
            <GlowCard
              isAlternate={true}
              color={vibrantColors[index % vibrantColors.length]}
            >
              <div className="w-full p-6 rounded-lg shadow-lg relative">
                <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                <p className="text-lg font-semibold mb-1">{job.company}</p>
                <p className="text-md text-gray-700 mb-2">{job.location}</p>
                {job.salary ? (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    {job.salary}
                  </span>
                ) : null}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    <ExternalLinkIcon className="w-4 h-4" />
                  </span>
                </div>
                <p
                  className="text-sm text-gray-800 line-clamp-2 mt-2"
                  dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                ></p>
              </div>
            </GlowCard>
          </div>
        );
      })}
    </div>
  );
}
