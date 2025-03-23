"use client";

import { UserRound, Building2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const lineVariants = {
    hidden: { width: "0%" },
    visible: {
      width: "100%",
      transition: { duration: 1.2, ease: "easeInOut" },
    },
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      },
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.3 },
    },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="flex justify-center py-16 md:py-24 overflow-hidden">
      <div className="container px-4 md:px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Our platform connects talented professionals with great companies
            through a simple, streamlined process.
          </p>
        </motion.div>

        {/* Mobile view (vertical) */}
        <motion.div
          className="md:hidden space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative bg-white dark:bg-zinc-800/50 rounded-xl p-6 shadow-lg border border-zinc-200 dark:border-zinc-700/50 transition-transform hover:-translate-y-1 duration-300"
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <motion.div
                className="absolute -top-4 -left-2 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md"
                variants={iconVariants}
                whileHover="hover"
              >
                {index + 1}
              </motion.div>

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
            </motion.div>
          ))}
        </motion.div>

        {/* Desktop view (horizontal) */}
        <div className="hidden md:block relative max-w-6xl mx-auto">
          {/* Connecting line */}
          <motion.div
            className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 -translate-y-1/2 z-0 rounded-full shadow-sm"
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          ></motion.div>

          <motion.div
            className="grid grid-cols-3 gap-8 relative z-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                variants={itemVariants}
              >
                {/* Step number */}
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl z-20 shadow-lg"
                  variants={iconVariants}
                  whileHover="hover"
                >
                  {index + 1}
                </motion.div>

                {/* Card */}
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 pt-10 shadow-lg border border-zinc-200 dark:border-zinc-700/50 mt-7 relative"
                  whileHover={{
                    y: -5,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <h3 className="text-xl font-semibold mb-5 text-center">
                    {step.title}
                  </h3>

                  <div className="grid gap-6">
                    <motion.div
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      viewport={{ once: true }}
                    >
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
                    </motion.div>

                    <motion.div
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      viewport={{ once: true }}
                    >
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
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="mt-20 text-center"
          variants={ctaVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div
            className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href={"/signup"}>
              <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 text-white font-semibold shadow-md hover:shadow-lg transition-shadow duration-300">
                Ready to get started?
              </div>
            </Link>
          </motion.div>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
            Join thousands of professionals and companies who have already found
            their perfect match on our platform.
          </p>
        </motion.div>
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
