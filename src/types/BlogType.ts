export type BlogType = {
  id: string;
  image: string | null;
  created_at: Date;
  content: string | null;
  description: string | null;
  title: string;
  type: string;
  userId: string;
};