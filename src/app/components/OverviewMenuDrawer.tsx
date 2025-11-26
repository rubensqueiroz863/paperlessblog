"use client";

import { useBlogCreationMenu, useClientMenu, useOverviewMenu } from "@/menu";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import UserMenu from "./UserMenu";
import { UserProps } from "@/types/UserProps";
import UserIcon from "./UserIcon";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BlogCard from "./BlogCard";
import { BlogType } from "@/types/BlogType";
import LoadingSpinner from "./LoadingSpinner";

export default function OverviewMenuDrawer({ user }: Readonly<{ user: UserProps}>) {
  const [width, setWidth] = useState(250);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isResizing = useRef(false);
  const overviewMenu = useOverviewMenu();
  const clientMenu = useClientMenu();

  const router = useRouter();

  const creationMenu = useBlogCreationMenu();

  useEffect(() => {
    const handleLeave = (e: MouseEvent) => {
      if (e.clientX < width) return;
      overviewMenu.closeMenu();
    }
    document.addEventListener("mousemove", handleLeave);
    return () => document.removeEventListener("mousemove", handleLeave);
  }, [width, overviewMenu])

  const handleMouseDown = () => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current || e.clientX > 400) return;
    setWidth(Math.max(250, e.clientX)); // largura mínima de 250px
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp); // ✅ remover corretamente
  };

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/getBlogs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) return;
        setIsLoading(false);
        return res.json();
      })
      .then(data => {
        if (data && data.blogs) {
          setBlogs(data.blogs); // <-- IMPORTANTE!
        }
      })
      .catch(err => {
        console.warn("Erro ao buscar blogs:", err.message);
      });
      setIsLoading(false);
  }, []); 


  return (
    <div className={`flex ${clientMenu.isOpen ? "pointer-events-auto" : ""} ${overviewMenu.isLocked ? "" : "fixed left-0 top-0 py-10"} h-screen pointer-events-none`}>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{ width }}
        className="flex h-full pointer-events-auto" // 👈 reativa aqui
        onMouseLeave={() => {
          if (!overviewMenu.isLocked) overviewMenu.closeMenu();
        }}
      >
        <div
          className={`flex ${
            overviewMenu.isLocked
              ? "h-full w-full m-0"
              : "h-2/3 m-2 rounded-sm"
          } bg-gray-300 flex-col dark:bg-neutral-800 w-full`}
        >
          <button
            onClick={clientMenu.toggleMenu}
            className={`flex m-1 rounded-md w-full h-8 items-center gap-2 p-2 ${clientMenu.isOpen ? "bg-[#333333]" : ""} hover:bg-[#333333] transition-all cursor-pointer`}
          >
            <UserIcon user={user} width={"6"} height={"6"}/>
            <p className="dark:text-white">{user?.name}</p>
          </button>

          <button
            onClick={() => router.push("/search")}
            className="flex mx-1 my-0.5 rounded-md w-full h-8 items-center gap-1.5 font-semibold text-[15px] p-2 hover:bg-[#333333] transition-all cursor-pointer"
          >
            <Image
              src={"https://i.postimg.cc/k41yLbtw/search-521.png"}
              alt={"imagem de lupa ou lupe image"}
              width={128}
              height={128}
              className="w-4 h-4"
            />
            <p className="text-neutral-400">Pesquisar</p>
          </button>

          <button
            onClick={() => router.push("/overview")}
            className="flex mx-1 my-0.5 rounded-md w-full h-8 items-center gap-1.5 font-semibold text-[15px] p-2 hover:bg-[#333333] transition-all cursor-pointer"
          >
            <Image
              src={"https://i.postimg.cc/bwMRg6v1/8367621.png"}
              alt={"imagem de inicio ou home image"}
              width={128}
              height={128}
              className="w-4 h-4"
            />
            <p className="text-neutral-400">Home</p>
          </button>

          <p className="ml-3 text-sm mt-6 font-semibold text-neutral-400">Blogs</p>

          <button
            onClick={creationMenu.openMenu}
            className="flex mx-1 my-0.5 rounded-md w-full h-8 items-center gap-2 font-semibold text-[15px] p-2 hover:bg-[#333333] transition-all cursor-pointer"
          >
            <Image
              src={"https://i.postimg.cc/Vvw2dJZJ/plus-PNG100.png"}
              alt={"new blog icon"}
              width={128}
              height={128}
              className="w-3 h-3"
            />
            <p className="text-neutral-400">New blog</p>
          </button>

          {/* LISTAGEM DOS BLOGS AQUI */}
          {
            isLoading ? (
              <LoadingSpinner width="w-10 h-10"/>
            ) : (
              <div className="mt-2 h-80 max-h-90 custom-scroll overflow-y-auto pr-1">
                {blogs.length > 0 ? (
                  blogs.map((blog: BlogType) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))
                ) : (
                  <p className="text-neutral-500 text-xs ml-4">Nenhum blog criado ainda.</p>
                )}
              </div>
            )
          }
          

          { clientMenu.isOpen ? (
              <UserMenu user={user} onClose={clientMenu.closeMenu}/>
            ): (
              <div></div>
          )}

          {/* botão de resize também precisa responder */}
          <button
            onMouseDown={handleMouseDown}
            className="flex cursor-ew-resize ml-auto w-1 h-full"
          />
        </div>
      </motion.div>
      
    </div>

  );

}
