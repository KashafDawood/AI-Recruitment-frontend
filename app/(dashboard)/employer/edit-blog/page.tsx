"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/custom/richTextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBlogBySlug, updateBlog } from "@/api/blogs/blogApi";
import { toast } from "sonner";
import {
  Loader2,
  Image as ImageIcon,
  UploadCloud,
  ArrowLeft,
} from "lucide-react";
import OptimizeImage from "@/components/custom/optimizeImage";

const blogFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  keywords: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  status: z.enum(["draft", "published", "archived"]),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

export default function EditBlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState<string | null>(
    null
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  useEffect(() => {
    if (!slug) {
      toast.error("Blog not found");
      router.push("/employer/blogs");
      return;
    }

    const fetchBlog = async () => {
      setIsFetching(true);
      try {
        const blog = await getBlogBySlug(slug);
        reset({
          title: blog.title,
          content: blog.content,
          keywords: blog.keywords || "",
          category: blog.category || "",
          status: blog.status,
        });
        if (blog.thumbnail) {
          setCurrentThumbnailUrl(blog.thumbnail);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog post");
        router.push("/employer/blogs");
      } finally {
        setIsFetching(false);
      }
    };

    fetchBlog();
  }, [slug, reset, router]);

  const onSubmit = async (data: BlogFormValues) => {
    if (!slug) return;

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

      await updateBlog(slug, formData);
      toast.success("Blog post updated successfully!");
      router.push("/employer/blogs");
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast.error("Failed to update blog post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      setCurrentThumbnailUrl(null);

      // Create and set preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const watchedCategory = watch("category");
  const watchedStatus = watch("status");

  if (isFetching) {
    return (
      <div className="container mx-auto py-12 max-w-4xl">
        <Card className="border-none shadow-lg bg-white/70 backdrop-blur-md dark:bg-gray-900/70">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Loading blog post...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 max-w-4xl"
    >
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/employer/blogs")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blogs
      </Button>

      <Card className="border-none shadow-xl overflow-hidden bg-white/90 backdrop-blur-md dark:bg-gray-900/90">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-400 text-white">
          <CardTitle className="text-2xl">Edit Blog Post</CardTitle>
          <CardDescription className="text-green-50">
            Update your blog post content and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter an engaging blog title"
                className="h-12"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-base font-medium">
                Content
              </Label>
              <RichTextEditor
                content={watch("content")}
                onChange={(html) =>
                  setValue("content", html, { shouldValidate: true })
                }
                placeholder="Write your blog content here..."
              />
              {errors.content && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-medium">
                  Category
                </Label>
                <Select
                  value={watchedCategory}
                  onValueChange={(value) => setValue("category", value)}
                >
                  <SelectTrigger className="h-12">
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
                  <p className="text-sm text-red-500 mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords" className="text-base font-medium">
                  Keywords (comma separated)
                </Label>
                <Input
                  id="keywords"
                  placeholder="e.g. recruitment, technology, career"
                  className="h-12"
                  {...register("keywords")}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="thumbnail" className="text-base font-medium">
                Thumbnail Image
              </Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 transition-all hover:border-green-500 dark:hover:border-green-400">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="text-center">
                    {currentThumbnailUrl && !previewUrl ? (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Current thumbnail:
                        </p>
                        <div className="w-full h-48 max-w-md mx-auto relative rounded-lg overflow-hidden shadow-md">
                          <OptimizeImage
                            src={currentThumbnailUrl}
                            alt="Current thumbnail"
                            className="w-full h-full object-cover"
                            width={500}
                            height={300}
                          />
                        </div>
                      </div>
                    ) : previewUrl ? (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          New thumbnail preview:
                        </p>
                        <div className="w-full h-48 max-w-md mx-auto relative rounded-lg overflow-hidden shadow-md">
                          <OptimizeImage
                            src={previewUrl}
                            alt="New thumbnail preview"
                            className="w-full h-full object-cover"
                            width={500}
                            height={300}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <ImageIcon className="h-12 w-12 mb-2" />
                        <p className="text-sm">No thumbnail selected</p>
                      </div>
                    )}

                    <div className="mt-4 flex justify-center">
                      <label htmlFor="thumbnail" className="cursor-pointer">
                        <div className="flex items-center justify-center px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg transition-colors hover:bg-green-100 dark:hover:bg-green-900/50">
                          <UploadCloud className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">
                            {currentThumbnailUrl || previewUrl
                              ? "Change thumbnail"
                              : "Upload thumbnail"}
                          </span>
                        </div>
                        <Input
                          id="thumbnail"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-base font-medium">
                Status
              </Label>
              <Select
                value={watchedStatus}
                onValueChange={(value) =>
                  setValue(
                    "status",
                    value as "draft" | "published" | "archived"
                  )
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/employer/blogs")}
                disabled={isLoading}
                className="h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 min-w-32 bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Blog Post"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
