"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { generateBlog } from "@/api/ai/generateBlog";

const blogGeneratorSchema = z.object({
  blog_title: z.string().min(5, "Title must be at least 5 characters"),
  blog_description: z.string().min(20, "Description must be at least 20 characters"),
  blog_keywords: z.string().optional(),
  blog_length: z.string().optional(),
});

type BlogGeneratorFormValues = z.infer<typeof blogGeneratorSchema>;

interface BlogGeneratorFormProps {
  onBlogGenerated: (blogContent: string) => void;
  onClose: () => void;
}

export default function BlogGeneratorForm({ onBlogGenerated, onClose }: BlogGeneratorFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BlogGeneratorFormValues>({
    resolver: zodResolver(blogGeneratorSchema),
    defaultValues: {
      blog_title: "",
      blog_description: "",
      blog_keywords: "",
      blog_length: "600 words",
    },
  });

  const onSubmit = async (data: BlogGeneratorFormValues) => {
    setIsGenerating(true);
    try {
      const response = await generateBlog(data);
      toast.success("Blog post generated successfully!");
      onBlogGenerated(response.blog);
      onClose();
    } catch (error) {
      console.error("Error generating blog post:", error);
      toast.error("Failed to generate blog post. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="blog_title" className="text-base font-medium">
          Blog Title
        </Label>
        <Input
          id="blog_title"
          placeholder="Enter a title for your blog post"
          className="h-10"
          {...register("blog_title")}
        />
        {errors.blog_title && (
          <p className="text-sm text-destructive font-medium">
            {errors.blog_title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="blog_description" className="text-base font-medium">
          Description
        </Label>
        <Textarea
          id="blog_description"
          placeholder="Describe what you want the blog to be about in detail"
          className="min-h-[100px] resize-y"
          {...register("blog_description")}
        />
        {errors.blog_description && (
          <p className="text-sm text-destructive font-medium">
            {errors.blog_description.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="blog_keywords" className="text-base font-medium">
            Keywords (Optional)
          </Label>
          <Input
            id="blog_keywords"
            placeholder="e.g. recruitment, technology, career"
            className="h-10"
            {...register("blog_keywords")}
          />
          <p className="text-xs text-muted-foreground">
            Separate with commas for better results
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="blog_length" className="text-base font-medium">
            Blog Length
          </Label>
          <Select
            onValueChange={(value) => setValue("blog_length", value)}
            defaultValue={watch("blog_length")}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="600 words">Short (600 words)</SelectItem>
              <SelectItem value="800 words">Medium (800 words)</SelectItem>
              <SelectItem value="1000 words">Long (1000 words)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isGenerating}>
          Cancel
        </Button>
        <Button type="submit" disabled={isGenerating} className="relative">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Blog
            </>
          )}
        </Button>
      </div>
    </form>
  );
}