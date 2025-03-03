"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  state: "initial" | "loading" | "success";
  onReset?: () => void;
  onSave?: () => void;
}

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    className="text-current"
  >
    <title>circle-info</title>
    <g
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <circle cx="9" cy="9" r="7.25"></circle>
      <line x1="9" y1="12.819" x2="9" y2="8.25"></line>
      <path
        d="M9,6.75c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z"
        fill="currentColor"
        data-stroke="none"
        stroke="none"
      ></path>
    </g>
  </svg>
);

const springConfig = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 1,
};

export default function UpdateButton({
  state = "initial",
  onReset,
  onSave,
}: ToastProps) {
  const commonClasses = `h-10 rounded-[99px] 
    dark:bg-[#131316] bg-white 
    dark:text-white text-gray-800
    shadow-sm dark:shadow-md 
    dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.08)]
    shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08)]
    dark:border-white/5 border-gray-200 border
    justify-center items-center inline-flex overflow-hidden`;

  return (
    <motion.div
      className={commonClasses}
      initial={false}
      animate={{ width: "auto" }}
      transition={springConfig}
    >
      <div className="flex items-center justify-between h-full px-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            {state === "loading" && (
              <>
                <IOSpinner />
                <div className="text-[13px] font-normal leading-tight whitespace-nowrap">
                  Saving
                </div>
              </>
            )}
            {state === "success" && (
              <>
                <div className="p-0.5 dark:bg-white/25 bg-gray-200/80 rounded-[99px] shadow-sm dark:border-white/10 border-gray-300 border justify-center items-center gap-1.5 flex overflow-hidden">
                  <Check className="w-3.5 h-3.5 dark:text-white text-gray-700" />
                </div>
                <div className="text-[13px] font-normal leading-tight whitespace-nowrap">
                  Changes Saved
                </div>
              </>
            )}
            {state === "initial" && (
              <>
                <InfoIcon />
                <div className="text-[13px] font-normal leading-tight whitespace-nowrap">
                  Unsaved changes
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          {state === "initial" && (
            <motion.div
              className="flex items-center gap-2 ml-2"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ ...springConfig, opacity: { duration: 0 } }}
            >
              <button
                onClick={onReset}
                className="px-3 py-1 rounded-[99px] justify-center items-center flex dark:hover:bg-white/[0.08] hover:bg-gray-100 transition-colors"
              >
                <div className="text-[13px] font-normal leading-tight">
                  Reset
                </div>
              </button>
              <div
                onClick={onSave}
                className="h-7 px-3 bg-green-400 rounded-[99px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.10)] justify-center items-center inline-flex overflow-hidden cursor-pointer hover:bg-green-500 active:bg-green-600 transition-all duration-200"
              >
                <div className="text-gray-800 text-[13px] font-medium leading-tight">
                  Save
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const IOSpinner = () => {
  return (
    <div className="animate-spin relative w-4 h-4">
      <div className="absolute w-full h-full rounded-full border-2 dark:border-white/20 border-gray-300/70"></div>
      <div className="absolute w-full h-full rounded-full border-2 border-transparent dark:border-t-white border-t-gray-800"></div>
    </div>
  );
};
