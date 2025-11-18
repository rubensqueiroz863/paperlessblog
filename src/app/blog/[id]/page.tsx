import { getBlog } from "@/app/actions";
import GeneralNavBar from "@/app/components/GeneralNavBar";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;
  const blog = await getBlog(id);

  return (
    <div className="bg-neutral-600 min-h-screen">
      <GeneralNavBar />
      <div className="px-8">
        <div className="flex flex-col gap-8 text-white p-8 min-h-[80vh] mx-auto my-14 sm:max-w-4xl xl:max-w-5xl bg-neutral-500 rounded-xl">
          <h1 className="text-2xl font-bold">{blog?.title}</h1>
          <div className="bg-neutral-600 break-words p-4 w-full min-h-[60vh] rounded-lg">
            {blog?.content}
          </div>
        </div>
      </div>
    </div>
  );

}