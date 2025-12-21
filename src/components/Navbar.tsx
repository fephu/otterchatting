"use client";

import Image from "next/image";
import logoImg from "@/app/icon.svg";
import avatarImg from "@/assets/avatar.jpg";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const logoutUser = () => {
    logout();

    router.push("/");
  };

  return (
    <div className="flex items-center justify-between py-10">
      <div className="flex items-center justify-center gap-1">
        <Image src={logoImg} alt="logo" className="w-16" />
        <h1 className="text-xl font-semibold tracking-tighter text-green-500">
          otterchatting
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={logoutUser}
          className="text-zinc-400 font-medium text-sm cursor-pointer"
        >
          logout
        </button>
        <p className="text-zinc-400 font-medium text-sm">{user?.username}</p>
        <Image src={avatarImg} alt="logo" className="size-8 rounded-full" />
      </div>
    </div>
  );
};

export default Navbar;
