"use client";

import { UserProps } from "@/types/UserProps";
import UserIcon from "./UserIcon";
import Image from "next/image";
import { useSettingsMenu } from "@/menu";
import { useEffect, useRef, useState } from "react";
import LogoutMenu from "./LogoutMenu";

export default function UserMenu({ user, onClose }: Readonly<{ user: UserProps, onClose: () => void }>) {
  const menuRef = useRef<HTMLDivElement>(null);
  const settingsMenu = useSettingsMenu(); // settingsMenu.isOpen
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const [texts, setTexts] = useState({
    settingsBtn: "Configurações",
    shareBtn: "Compartilhar",
  })

  useEffect(() => {
    const lang = navigator.language;

    if (lang === "pt-BR") {
      setTexts({
        settingsBtn: "Configurações",
        shareBtn: "Compartilhar",
      });
    } else {
      setTexts({
        settingsBtn: "Settings",
        shareBtn: "Share",
      });
    }
  }, [])

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Paperless blog",
        text: "Acesse o Paperless Blog e descubra novos conteúdos incríveis!",
        url: window.location.origin,
      });
      console.log("compartilhado com sucesso");
    } catch (error: unknown) {
      console.log("Usuario cancelou o compartilhamento");
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!settingsMenu.isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, settingsMenu.isOpen]);

  
  const useMenu = useSettingsMenu()
  const handleShowSettings = () => {
    useMenu.toggleMenu();
  }

  return (
    <div className="fixed dark:text-white inset-0 z-1 flex items-center justify-center">
        <div ref={menuRef} className="flex flex-col  absolute left-4 top-20 w-70 h-65 border rounded-lg border-neutral-700 dark:bg-neutral-800 bg-white">
          <div
            className="flex px-3 w-full my-2 h-1/4 dark:text-white gap-2 items-center">
            <UserIcon user={user} text="3xl" padding="px-5 py-5"/>
            <div className="">
              <p className="text-sm">{user?.name}</p>
              <p className="text-xs text-neutral-400">0 blogs</p>
            </div>
            
          </div>
          <div className="flex px-3 gap-2 mb-3">
            <button
              onClick={handleShowSettings}
              className="flex text-center justify-center w-34 items-center border text-neutral-500 rounded-lg cursor-pointer px-0.5 pr-1.5"
            >
              <Image
                src={"https://i.postimg.cc/4ykqVqbW/Gear-icon.png"}
                width={24}
                height={24}
                alt="settings"
              />
              {texts.settingsBtn}
            </button>
            <button
              onClick={handleShare}
              className="flex w-27 text-center justify-center items-center border text-neutral-500 rounded-lg cursor-pointer"
            >
              {texts.shareBtn}
            </button>
          </div>
          <div className="h-0.5 w-full bg-neutral-700"></div>
          <div className="flex gap-8 h-full p-3 w-full bg-[#1f1f1f] rounded-b-md">
            <p className="text-sm text-neutral-400">{user.email}</p>
            
            <div
              onClick={() => setShowLogoutMenu(!showLogoutMenu)}
              className="flex text-neutral-400 cursor-pointer items-center justify-center w-5 h-5 gap-0.5 rounded-full hover:bg-neutral-700">
              <span>·</span>
              <span>·</span>
              <span>·</span>
              
            </div>
            
          </div>
            { showLogoutMenu ? 
              <LogoutMenu /> :
              <div></div>
            }
        </div>
      </div>
    
  );
}