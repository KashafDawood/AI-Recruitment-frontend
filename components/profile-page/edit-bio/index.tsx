"use client";
import React from "react";
import { Button } from "../../ui/button";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type BioProps = {
  bio?: string;
  onEditCencel?: () => void;
};

export default function EditProfileBio({ bio, onEditCencel }: BioProps) {
  return (
    <div className="relative py-10 px-6 md:px-10">
      <div className="flex justify-between">
        <h1 className="text-6xl font-bold font-aclonica text-start">
          My Story
        </h1>
        <Button
          onClick={onEditCencel}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-20 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700"
          title="Edit Profile"
        >
          <X size={18} />
        </Button>
      </div>
      <div className="py-8">
        <Textarea
          className="resize-none dark:border-white border-black"
          placeholder="Type your Bio Here"
          value={bio || ""}
          rows={20}
        />
      </div>
    </div>
  );
}
