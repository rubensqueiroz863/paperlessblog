"use client"

import { useGeneralMenu } from "@/menu"

export default function GeneralNavBar() { 
  const menu = useGeneralMenu();
  return (
    <div
      className="flex h-10 px-4 py-2 justify-between w-full bg-white dark:bg-neutral-800"
    >
      <div
          onClick={menu.toggleMenu}
          className="flex flex-col justify-between w-5 h-4 mt-1 cursor-pointer relative"
        >
          <span
            className={`h-0.5 w-full dark:bg-neutral-200 bg-neutral-900 rounded-lg transition-transform duration-300 ${
              menu.isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`h-0.5 w-full dark:bg-neutral-200 bg-neutral-900 rounded-lg transition-all duration-300 ${
              menu.isOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`h-0.5 w-full dark:bg-neutral-200 bg-neutral-900 rounded-lg transition-transform duration-300 ${
              menu.isOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </div>
    </div>
  )
}