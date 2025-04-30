"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
import { createBlog } from "@/api/blogs/blogApi";
import { toast } from "sonner";
import { Loader2, FileImage, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const blogFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  keywords: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  status: z.enum(["draft", "published"]),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

export default function CreateBlogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      content: "",
      keywords: "",
      category: "",
      status: "draft",
    },
  });

  const onSubmit = async (data: BlogFormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("keywords", data.keywords || "");
      formData.append("category", data.category);
      formData.append("status", data.status);

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      await createBlog(formData);
      toast.success("Blog post created successfully!");
      reset();
      setThumbnail(null);
      setThumbnailPreview(null);
      router.push("/employer/blogs");
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast.error("Failed to create blog post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Create Blog Post
              </CardTitle>
              <CardDescription className="text-muted-foreground pt-1">
                Share your insights and knowledge with the Stafee community
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
          </div>
          <Separator className="my-2" />
        </CardHeader>
        <CardContent>
          <form
            id="blog-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-7"
          >
            <div className="space-y-3">
              <Label htmlFor="title" className="text-base font-medium">
                Blog Title
              </Label>
              <Input
                id="title"
                placeholder="Enter a compelling title for your blog post"
                className="h-11"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive font-medium">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="category" className="text-base font-medium">
                  Category
                </Label>
                <Select
                  onValueChange={(value) => setValue("category", value)}
                  defaultValue={watch("category")}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="career">Career</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="recruitment">Recruitment</SelectItem>
                    <SelectItem value="industry">Industry</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="keywords" className="text-base font-medium">
                  Keywords
                </Label>
                <Input
                  id="keywords"
                  placeholder="e.g. recruitment, technology, career"
                  className="h-11"
                  {...register("keywords")}
                />
                <p className="text-xs text-muted-foreground">
                  Separate with commas for better discoverability
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="content" className="text-base font-medium">
                Content
              </Label>
              <Textarea
                id="content"
                placeholder="Write your blog content here..."
                className="min-h-[250px] resize-y"
                {...register("content")}
              />
              {errors.content && (
                <p className="text-sm text-destructive font-medium">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="thumbnail" className="text-base font-medium">
                Thumbnail Image
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-secondary/20 transition-colors cursor-pointer relative overflow-hidden">
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="py-4 flex flex-col items-center justify-center">
                    <FileImage className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Click to upload image</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG or WEBP (recommended: 1200×630px)
                    </p>
                  </div>
                </div>

                {thumbnailPreview ? (
                  <div className="border rounded-lg overflow-hidden h-[150px]">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 flex items-center justify-center h-[150px] bg-muted/30">
                    <p className="text-sm text-muted-foreground text-center">
                      Your thumbnail preview will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="status" className="text-base font-medium">
                  Publish Status
                </Label>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Info className="h-3.5 w-3.5 mr-1" />
                  <span>You can publish later from your blog dashboard</span>
                </div>
              </div>
              <Select
                onValueChange={(value) =>
                  setValue("status", value as "draft" | "published")
                }
                defaultValue={watch("status")}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Save as Draft</SelectItem>
                  <SelectItem value="published">Publish Immediately</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 border-t px-6 py-4 bg-muted/20">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
            className="w-[120px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="blog-form"
            disabled={isLoading || !isDirty}
            className="w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Create Post"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
