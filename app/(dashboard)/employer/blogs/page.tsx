"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  getEmployerAllBlogs,
  updateBlogStatus,
  deleteBlog,
} from "@/api/blogs/blogApi";
import { Blog } from "@/types/blog";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  Eye,
  PlusCircle,
  Archive,
  FileEdit,
  AlertCircle,
  Loader2,
  Search,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...blogs];

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((blog) => blog.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          (blog.category && blog.category.toLowerCase().includes(query))
      );
    }

    setFilteredBlogs(result);
  }, [blogs, searchQuery, statusFilter]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await getEmployerAllBlogs(
        1,
        10,
        statusFilter !== "all" ? statusFilter : ""
      );
      const blogsData = response.results || [];
      setBlogs(blogsData);

      // Reapply filters after fetching blogs
      let result = [...blogsData];

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (blog) =>
            blog.title.toLowerCase().includes(query) ||
            (blog.category && blog.category.toLowerCase().includes(query))
        );
      }

      setFilteredBlogs(result);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = () => {
    router.push("/employer/create-blog");
  };

  const handleViewBlog = (slug: string) => {
    router.push(`/blogs/${slug}`);
  };

  const handleEditBlog = (slug: string) => {
    router.push(`/employer/edit-blog?slug=${slug}`);
  };

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;

    try {
      await deleteBlog(blogToDelete.slug);
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    } finally {
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    }
  };

  const handleStatusChange = async (blog: Blog, newStatus: string) => {
    setStatusUpdating(blog.slug); // Set loading state
    try {
      const formData = new FormData();
      formData.append("status", newStatus);
      await updateBlogStatus(blog.slug, formData);
      toast.success(`Blog status updated to ${newStatus}`);
      fetchBlogs();
    } catch (error) {
      console.error("Error updating blog status:", error);
      toast.error("Failed to update blog status");
    } finally {
      setStatusUpdating(null); // Reset loading state
    }
  };

  const getStatusBadge = (status: string, slug: string) => {
    if (statusUpdating === slug) {
      return (
        <Badge className="bg-gray-500 hover:bg-gray-600 flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Updating...
        </Badge>
      );
    }

    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Published</Badge>
        );
      case "draft":
        return (
          <Badge
            variant="outline"
            className="bg-background hover:bg-background text-foreground hover:text-foreground"
          >
            Draft
          </Badge>
        );
      case "archived":
        return (
          <Badge
            variant="secondary"
            className="bg-secondary hover:bg-secondary/80"
          >
            Archived
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getBlogCountByStatus = (status: string) => {
    if (status === "all") return blogs.length;
    return blogs.filter((blog) => blog.status === status).length;
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and publish your blog content
          </p>
        </div>
        <Button onClick={handleCreateBlog} className="shrink-0" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Blog
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={setStatusFilter}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList className="bg-muted/60">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-background"
            >
              All
              <Badge
                variant="secondary"
                className="ml-2 bg-muted hover:bg-muted"
              >
                {getBlogCountByStatus("all")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="published"
              className="data-[state=active]:bg-background"
            >
              Published
              <Badge
                variant="secondary"
                className="ml-2 bg-muted hover:bg-muted"
              >
                {getBlogCountByStatus("published")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="draft"
              className="data-[state=active]:bg-background"
            >
              Drafts
              <Badge
                variant="secondary"
                className="ml-2 bg-muted hover:bg-muted"
              >
                {getBlogCountByStatus("draft")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="data-[state=active]:bg-background"
            >
              Archived
              <Badge
                variant="secondary"
                className="ml-2 bg-muted hover:bg-muted"
              >
                {getBlogCountByStatus("archived")}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search blogs..."
              className="pl-9 w-full sm:w-[250px] h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <BlogTable
            blogs={filteredBlogs}
            loading={loading}
            onView={handleViewBlog}
            onEdit={handleEditBlog}
            onDelete={(blog) => {
              setBlogToDelete(blog);
              setDeleteDialogOpen(true);
            }}
            onStatusChange={handleStatusChange}
            getStatusBadge={getStatusBadge}
            onCreateClick={handleCreateBlog}
          />
        </TabsContent>
        <TabsContent value="published" className="mt-0">
          <BlogTable
            blogs={filteredBlogs}
            loading={loading}
            onView={handleViewBlog}
            onEdit={handleEditBlog}
            onDelete={(blog) => {
              setBlogToDelete(blog);
              setDeleteDialogOpen(true);
            }}
            onStatusChange={handleStatusChange}
            getStatusBadge={getStatusBadge}
            onCreateClick={handleCreateBlog}
          />
        </TabsContent>
        <TabsContent value="draft" className="mt-0">
          <BlogTable
            blogs={filteredBlogs}
            loading={loading}
            onView={handleViewBlog}
            onEdit={handleEditBlog}
            onDelete={(blog) => {
              setBlogToDelete(blog);
              setDeleteDialogOpen(true);
            }}
            onStatusChange={handleStatusChange}
            getStatusBadge={getStatusBadge}
            onCreateClick={handleCreateBlog}
          />
        </TabsContent>
        <TabsContent value="archived" className="mt-0">
          <BlogTable
            blogs={filteredBlogs}
            loading={loading}
            onView={handleViewBlog}
            onEdit={handleEditBlog}
            onDelete={(blog) => {
              setBlogToDelete(blog);
              setDeleteDialogOpen(true);
            }}
            onStatusChange={handleStatusChange}
            getStatusBadge={getStatusBadge}
            onCreateClick={handleCreateBlog}
          />
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-destructive">
              <AlertCircle className="h-5 w-5 mr-2" />
              Delete Blog Post
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the blog post titled &quot;
              {blogToDelete?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBlog}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface BlogTableProps {
  blogs: Blog[];
  loading: boolean;
  onView: (slug: string) => void;
  onEdit: (slug: string) => void;
  onDelete: (blog: Blog) => void;
  onStatusChange: (blog: Blog, newStatus: string) => void;
  getStatusBadge: (status: string, slug: string) => React.ReactNode;
  onCreateClick: () => void;
}

function BlogTable({
  blogs,
  loading,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  getStatusBadge,
  onCreateClick,
}: BlogTableProps) {
  if (loading) {
    return (
      <Card className="col-span-3 border border-border/40">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      </Card>
    );
  }

  if (blogs.length === 0) {
    return (
      <Card className="col-span-3 border border-border/40">
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <FileEdit className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No blog posts found</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            You haven&apos;t created any blog posts that match your current
            filters, or you haven&apos;t created any posts yet.
          </p>
          <Button onClick={onCreateClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Your First Blog Post
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-border/40">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40%]">Title</TableHead>
              <TableHead className="w-[15%]">Category</TableHead>
              <TableHead className="w-[15%]">Created</TableHead>
              <TableHead className="w-[15%]">Status</TableHead>
              <TableHead className="text-right w-[15%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id} className="group">
                <TableCell
                  className="font-medium py-4 cursor-pointer"
                  onClick={() => onView(blog.slug)}
                >
                  <div className="line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                  </div>
                </TableCell>
                <TableCell>
                  {blog.category ? (
                    <Badge variant="outline" className="font-normal">
                      {blog.category}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Uncategorized
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(blog.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>{getStatusBadge(blog.status, blog.slug)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                      <DropdownMenuItem onClick={() => onView(blog.slug)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(blog.slug)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />

                      {blog.status !== "published" && (
                        <DropdownMenuItem
                          onClick={() => onStatusChange(blog, "published")}
                        >
                          <Badge className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                          <span>Publish</span>
                        </DropdownMenuItem>
                      )}
                      {blog.status !== "draft" && (
                        <DropdownMenuItem
                          onClick={() => onStatusChange(blog, "draft")}
                        >
                          <Badge className="h-2 w-2 rounded-full bg-orange-400 mr-2" />
                          <span>Move to Draft</span>
                        </DropdownMenuItem>
                      )}
                      {blog.status !== "archived" && (
                        <DropdownMenuItem
                          onClick={() => onStatusChange(blog, "archived")}
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          <span>Archive</span>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        onClick={() => onDelete(blog)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
