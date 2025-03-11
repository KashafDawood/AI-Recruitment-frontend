export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  bgColor?: string;
  category?: string;
}
