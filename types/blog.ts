export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  image?: string;
  bgColor?: string;
  category?: string;
  thumbnail?: string; 
}
