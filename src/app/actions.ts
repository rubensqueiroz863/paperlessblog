import prisma from "@/lib/prisma"
import { BlogType } from "@/types/BlogType"

export async function getBlog(blogId: string): Promise<BlogType | null> {
  try {
    const blog = await prisma.blogs.findUnique({
      where: {
        id: blogId,
      }
    })

    return blog;
  } catch(err) {
    console.error("Erro ao pegar blogs:", err);
    return null;
  }
}