"use client";

import Image from "next/image";
import logoImg from "@/app/icon.svg";
import UserDropdown from "./UserDropdown";
import { useAuthStore } from "@/stores/useAuthStore";

const Navbar = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex items-center justify-between py-10">
      <div className="flex items-center justify-center gap-1">
        <Image src={logoImg} alt="logo" className="w-18" />
        <h1 className="text-2xl font-semibold tracking-tighter text-green-500">
          otterchatting
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-zinc-400 text-sm">{user?.username}</p>
        <UserDropdown />
      </div>
    </div>
  );
};

export default Navbar;
