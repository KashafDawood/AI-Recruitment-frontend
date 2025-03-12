"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { X } from "lucide-react";
import { RichTextEditor } from "@/components/custom/richTextEditor";
import { updateBio } from "@/api/candidate/updateBio";
import { toast } from "sonner";
import UpdateButton from "../../custom/updateButton";
import { useUserStore } from "@/store/userStore";

type BioProps = {
  bio?: string;
  onEditCencel?: () => void;
};

export default function EditProfileBio({ bio, onEditCencel }: BioProps) {
  const [content, setContent] = useState(bio || "");
  const [originalContent, setOriginalContent] = useState(bio || "");
  const [isDirty, setIsDirty] = useState(false);
  const [updateState, setUpdateState] = useState<
    "initial" | "loading" | "success"
  >("initial");
  const { refreshUser } = useUserStore();

  // Add a key state to force re-render of RichTextEditor when reset
  const [editorKey, setEditorKey] = useState(Date.now());

  useEffect(() => {
    setOriginalContent(bio || "");
    setContent(bio || "");
  }, [bio]);

  useEffect(() => {
    const contentChanged = content !== originalContent;
    setIsDirty(contentChanged);

    // Reset to initial state if content changes after success
    if (contentChanged && updateState === "success") {
      setUpdateState("initial");
    }
  }, [content, originalContent, updateState]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSubmit = async () => {
    try {
      setUpdateState("loading");
      await updateBio(content);
      await refreshUser();

      setOriginalContent(content);
      setUpdateState("success");

      toast.success("Bio updated successfully");

      setTimeout(() => {
        if (onEditCencel) {
          onEditCencel();
        }
      }, 1500);
    } catch (error) {
      console.error("Error updating bio:", error);
      toast.error("Failed to update bio. Please try again.");
      setUpdateState("initial");
    }
  };

  const handleReset = () => {
    // Set content back to original
    setContent(originalContent);

    // Force re-render of the editor by changing its key
    setEditorKey(Date.now());

    // Show toast notification
    toast.info("Bio has been reset to original content");
  };

  const handleCancel = () => {
    if (onEditCencel) {
      onEditCencel();
    }
  };

  return (
    <div className="relative py-10 px-6 md:px-10">
      <div className="flex justify-between">
        <h1 className="text-6xl font-bold font-aclonica text-start">
          My Story
        </h1>
        <Button
          onClick={handleCancel}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-20 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700"
          title="Edit Profile"
        >
          <X size={18} />
        </Button>
      </div>
      <div className="py-8">
        <RichTextEditor
          key={editorKey}
          showToolbar={false}
          content={originalContent}
          placeholder="Type your Bio Here"
          onChange={handleContentChange}
        />
      </div>

      {/* UpdateButton */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        {(isDirty || updateState !== "initial") && (
          <UpdateButton
            state={updateState}
            onReset={handleReset}
            onSave={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
