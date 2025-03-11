import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X, Check } from "lucide-react";

type SkillsSectionProps = {
  skills: string[];
  setSkills: React.Dispatch<React.SetStateAction<string[]>>;
};

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, setSkills }) => {
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const skillInputRef = useRef<HTMLDivElement>(null);

  const handleAddSkillClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowSkillInput(true);
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSkill(e.target.value);
  };

  const handleSkillSave = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills((prev) => [...prev, newSkill]);
      resetSkillInput();
    }
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSkillSave();
    }
  };

  const resetSkillInput = () => {
    setNewSkill("");
    setShowSkillInput(false);
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToDelete));
  };

  // Handle clicks outside the skill input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSkillInput &&
        skillInputRef.current &&
        !skillInputRef.current.contains(event.target as Node)
      ) {
        resetSkillInput();
      }
    };

    if (showSkillInput) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSkillInput]);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm dark:text-gray-300 text-gray-700">Skills</p>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full dark:bg-gray-700 bg-white border-none"
          title="Add skill"
          onClick={handleAddSkillClick}
        >
          <Plus size={14} className="mr-1" />
          Add Skill
        </Button>
      </div>

      <div className="flex flex-wrap justify-center lg:justify-start gap-2">
        {skills.map((skill) => (
          <div key={skill} className="relative group">
            <Badge className="bg-white text-gray-800 hover:bg-gray-100 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:border-gray-600 rounded-full py-1 px-3 border-0 dark:border-0">
              {skill}
              <button
                type="button"
                className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                onClick={() => handleDeleteSkill(skill)}
              >
                <X size={12} />
              </button>
            </Badge>
          </div>
        ))}
      </div>

      {/* Skill Input Form */}
      {showSkillInput && (
        <div
          ref={skillInputRef}
          className="mt-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        >
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">
                New Skill
              </label>
              <input
                type="text"
                value={newSkill}
                onChange={handleSkillInputChange}
                onKeyPress={handleSkillKeyPress}
                placeholder="Enter skill"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                autoFocus
              />
            </div>
            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleSkillSave}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check size={16} className="mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
