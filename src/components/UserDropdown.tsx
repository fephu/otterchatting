"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";
import avatarImg from "@/assets/avatar.jpg";
import { useRouter } from "next/navigation";

const UserDropdown = () => {
  const { logout } = useAuthStore();
  const router = useRouter();

  const logoutUser = () => {
    logout();

    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image src={avatarImg} alt="logo" className="size-8 rounded-full" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="p-0 border-zinc-900"
        sideOffset={10}
      >
        <DropdownMenuItem
          className="cursor-pointer text-zinc-400"
          onClick={() => router.push("/home/profile")}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-zinc-400"
          onClick={logoutUser}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
