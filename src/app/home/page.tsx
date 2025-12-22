"use client";

import Joining from "@/components/Joining";
import Navbar from "@/components/Navbar";
import RoomList from "@/components/RoomList";
import { Plus } from "lucide-react";
import Link from "next/link";

const Page = () => {
  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4">
      <Navbar />

      <div className="">
        <div className="">
          <div className="flex items-center justify-between">
            <h1 className="text-lg tracking-tight text-zinc-300">
              Your available rooms
            </h1>
            <Link
              href={"/home/room/create"}
              className="size-8 p-1 text-zinc-300 text-sm hover:bg-zinc-900/90 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Plus className="text-green-600 size-6" />
            </Link>
          </div>

          <RoomList />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-lg tracking-tight text-zinc-300">Join a room</h1>

          <Joining />
        </div>
      </div>
    </main>
  );
};

export default Page;
