export interface Blog {
  id: number;
  title: string;
  content: string;
  thumbnail: string | null;
  keywords: string;
  created_at: string;
  updated_at: string;
  status: "draft" | "published" | "archived";
  slug: string;
  category: string;
  employer?: {
    id: number;
    email: string;
    name: string;
  };
}

export interface BlogListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Blog[];
}
