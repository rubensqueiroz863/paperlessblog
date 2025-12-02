"use client";

import { BlogType } from "@/types/BlogType";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BlogCard({ blog }: { blog: BlogType }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/blog/${blog.id}`)}
      className="ml-1 my-1 p-3 bg-neutral-700 hover:bg-neutral-600 transition-all rounded-md cursor-pointer flex items-center gap-3"
    >
      <Image
        src={blog?.image || "https://i.postimg.cc/y6rT5x5k/blog.png"}
        alt="blog thumbnail"
        width={40}
        height={40}
        className="w-10 h-10 rounded object-cover"
      />

      <div className="flex flex-1 justify-between items-center">
        {/* Título e descrição */}
        <div className="flex flex-col">
          <p className="text-white w-20 font-semibold text-sm truncate">{blog.title}</p>
          <p className="text-neutral-400 text-xs truncate w-24">
            {blog.description || "Sem descrição"}
          </p>
        </div>
      </div>
    </div>
  );
}
