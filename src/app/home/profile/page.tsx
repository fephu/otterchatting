"use client";

import avatarImg from "@/assets/avatar.jpg";
import { useAuthStore } from "@/stores/useAuthStore";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

const Page = () => {
  const { user } = useAuthStore();

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-20 text-zinc-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button className="size-8 hover:bg-zinc-900/90 p-1 cursor-pointer">
            <ChevronLeft className="size-6" />
          </button>
          <Image src={avatarImg} alt="logo" className="size-14 rounded-full" />
          <p className="text-zinc-400 text-lg">{user?.username}</p>
        </div>

        <button className="text-zinc-400">Edit</button>
      </div>
    </main>
  );
};

export default Page;
