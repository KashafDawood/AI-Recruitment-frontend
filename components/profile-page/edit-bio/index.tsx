"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { X } from "lucide-react";
import { RichTextEditor } from "@/components/custom/richTextEditor";
import { updateBio } from "@/api/candidate/updateBio";
import { toast } from "sonner";
import UpdateButton from "../../custom/updateButton";
import { useUserStore } from "@/store/userStore";
import { generateBio } from "@/api/ai/generateBio";

type BioProps = {
  bio?: string;
  onEditCencel?: () => void;
};

export default function EditProfileBio({ bio, onEditCencel }: BioProps) {
  //   const [generatedBio, setGeneratedBio] = useState("");
  const [content, setContent] = useState(bio || "");
  const [originalContent, setOriginalContent] = useState(bio || "");
  const [isDirty, setIsDirty] = useState(false);
  const [updateState, setUpdateState] = useState<
    "initial" | "loading" | "success"
  >("initial");
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
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

  const handleBioGeneration = async () => {
    try {
      setIsGeneratingBio(true);
      toast.info("Generating your bio with AI...");

      const { bio } = await generateBio();
      setContent(bio);
      setEditorKey(Date.now());
      setUpdateState("initial");
      setIsDirty(true);

      toast.success("Bio generated successfully!");
    } catch (error: any) {
      console.error("Error generating bio:", error);
      toast.error(
        error?.message || "Failed to generate bio. Please try again."
      );
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setUpdateState("loading");

      // Ensure we're sending a valid string by sanitizing HTML if needed
      const bioToSend = typeof content === "string" ? content : "";
      await updateBio(bioToSend);

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
          content={content} // Change from originalContent to content to reflect current state
          placeholder="Type your Bio Here..."
          onChange={handleContentChange}
          onAiGenerate={handleBioGeneration}
          isGenerating={isGeneratingBio}
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
