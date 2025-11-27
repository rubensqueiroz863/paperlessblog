import { getBlog } from "@/app/actions";
import GeneralNavBar from "@/app/components/GeneralNavBar";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const blog = await getBlog(id);
  if (!blog) return notFound();

  return (
    <div className="bg-neutral-900 min-h-screen text-neutral-100">
      <GeneralNavBar />

      <div className="px-8">
        <div className="flex flex-col gap-8 p-8 min-h-[80vh] mx-auto my-14 
          sm:max-w-4xl xl:max-w-5xl 
          bg-neutral-800 rounded-2xl shadow-lg shadow-black/20">

          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-white">{blog.title}</h1>

            <Image
              src={blog.image || ""}
              alt={blog.title}
              width={128}
              height={128}
              className="rounded-xl w-24 h-24 border border-neutral-700 object-cover"
            />
          </div>

          <article className="bg-neutral-700 break-words p-6 w-full min-h-[60vh] rounded-xl prose prose-invert max-w-none border border-neutral-600">
            {blog.content}
          </article>
        </div>
      </div>
    </div>

  );
}
