"use client";

import { useBlogCreationMenu, useOverviewMenu, useSettingsMenu } from "@/menu";
import NavBarOverview from "../components/NavBarOverviewTemp";
import OverviewMenuDrawer from "../components/OverviewMenuDrawer";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { UserType } from "@/types/UserType";
import SettingsMenu from "../components/SettingsMenu";
import BlogCreationMenu from "../components/BlogCreationMenu";
import LoadingSpinner from "../components/LoadingSpinner";
import BlogCard from "../components/BlogCard";
import { BlogType } from "@/types/BlogType";
import Image from "next/image";

export default function OverviewPage() {
  const menu = useOverviewMenu();
  const settingsMenu = useSettingsMenu();
  const [user, setUser] = useState<UserType | null>(null);
  const [error, setError] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [isHome, setIsHome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const creationMenu = useBlogCreationMenu();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://sticky-charil-react-blog-3b39d9e9.koyeb.app/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) {
          setError("Unauthorized");
        }
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => {
        // Impede que o erro apareça como "Uncaught"
        console.warn("Erro ao buscar usuário:", err.message);
      });
  }, []);

  
  useEffect(() => {
    if ("http://localhost:3000/" + "overview" === window.location.href) {
      setIsHome(true);
    }
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
    <div>

      {settingsMenu.isOpen && (
        <>
          {/* Fundo escuro */}
          <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"></div>

          {/* Menu de configurações sobreposto */}
          <div className="fixed inset-0 z-50">
            <SettingsMenu onClose={settingsMenu.closeMenu} />
          </div>
        </>
      )}

      <div className="flex bg-neutral-900 flex-col h-screen">
        <NavBarOverview />

        <div className="flex flex-1 overflow-hidden">
          {(menu.isOpen || menu.isLocked) && (
            <AnimatePresence mode="wait">
              <div className="shrink-0">
                {user && <OverviewMenuDrawer user={user} />}
              </div>
            </AnimatePresence>
          )}

          <div className="flex-1 w-full h-full dark:text-white bg-white dark:bg-neutral-900 p-4 overflow-auto">
            <div className="w-full flex items-center justify-center mt-10">
              <h1 className="text-2xl font-bold text-neutral-300">Bem vindo ao Paperless Blog!</h1>
            
            </div>
            <div className="flex mb-10 w-full items-center justify-center mt-10">
              {/* LISTAGEM DOS BLOGS AQUI */}
              {
                isLoading ? (
                  <LoadingSpinner width="w-10 h-10"/>
                ) : (
                  <div className="flex mt-2 h-20 custom-scroll overflow-y-auto pr-1">
                    {blogs.length > 0 ? (
                      blogs.map((blog: BlogType) => (
                        <BlogCard key={blog.id} blog={blog} />
                      ))
                    ) : (
                      <p className="text-neutral-500 text-md ml-4">Nenhum blog criado ainda.</p>
                    )}
                    <button
                      onClick={creationMenu.toggleMenu}
                      className={`ml-1 my-1 w-20 items-center justify-center p-3 bg-neutral-800 hover:bg-neutral-600 transition-all rounded-md cursor-pointer flex items-center gap-3 ${creationMenu.isOpen ? "bg-[#333333]" : ""} hover:bg-[#333333] transition-all cursor-pointer`}
                    >
                      <Image
                        src={"https://i.postimg.cc/Vvw2dJZJ/plus-PNG100.png"}
                        alt={"new blog icon"}
                        width={128}
                        height={128}
                        className="w-4 h-4"
                      />
                    </button>
                  </div>
                )
              }
            </div>
            {creationMenu.isOpen && (
              <>

                {/* Menu de configurações sobreposto */}
                <div className="flex">
                  <BlogCreationMenu onClose={creationMenu.closeMenu} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
