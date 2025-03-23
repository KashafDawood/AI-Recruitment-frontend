"use client";

import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import OptimizeImage from "../custom/optimizeImage";
import { motion } from "framer-motion";

const contributors = [
  {
    name: "Kashaf Dawood",
    role: "Software Engineer",
    avatar:
      "https://res.cloudinary.com/druaycgob/image/upload/v1740979681/ivhma5it6f7jxjrigipi.png",
    github: "https://github.com/KashafDawood",
    linkedin: "https://www.linkedin.com/in/kashafdawood/",
    email: "kashaf.dawood@gmail.com",
  },
  {
    name: "Sana Saghir",
    role: "Software Engineer",
    avatar:
      "https://res.cloudinary.com/druaycgob/image/upload/v1742049288/hijabi_placeholder_lsmoet.png",
    github: "https://github.com/sana-developer",
    linkedin: "https://www.linkedin.com/in/sana-saghir-83bb24249/",
    email: "sanasaghir979@gmail.com",
  },
];

export default function ContributorsSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
      <div className="mx-auto max-w-5xl border-t px-6">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-caption -ml-6 -mt-3.5 block w-max bg-gray-50 px-6 dark:bg-gray-950"
        >
          Contributors
        </motion.span>
        <div className="mt-12 gap-4 sm:grid sm:grid-cols-2 md:mt-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="sm:w-2/5"
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
              Project Contributors
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 sm:mt-0"
          >
            <p>
              We&apos;re two passionate developers collaborating on this final
              year project, combining our skills to create something meaningful.
            </p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-12 md:mt-24"
        >
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 max-w-3xl mx-auto">
            {contributors.map((contributor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.03 }}
                className="group overflow-hidden"
              >
                <OptimizeImage
                  className="h-96 bg-blue-500 w-full rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl"
                  src={contributor.avatar}
                  alt={`${contributor.name} - ${contributor.role}`}
                  width={826}
                  height={1239}
                />
                <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                  <div className="flex justify-between">
                    <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider">
                      {contributor.name}
                    </h3>
                    <span className="text-xs">_0{index + 1}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {contributor.role}
                    </span>
                    <div className="inline-flex translate-y-8 gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <Link
                        href={contributor.github}
                        target="_blank"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Github className="h-4 w-4" />
                      </Link>
                      <Link
                        href={contributor.linkedin}
                        target="_blank"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Linkedin className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`mailto:${contributor.email}`}
                        target="_blank"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Mail className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
