"use client";

import CreateRoomButton from "@/components/CreateRoomButton";
import Joining from "@/components/Joining";
import Navbar from "@/components/Navbar";
import RoomList from "@/components/RoomList";

const Page = () => {
  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4">
      <Navbar />

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <h1 className="text-lg tracking-tight text-zinc-400">Join a room</h1>

          <Joining />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-lg tracking-tight text-zinc-400">
              Your available rooms
            </h1>
            <CreateRoomButton />
          </div>

          <RoomList />
        </div>
      </div>
    </main>
  );
};

export default Page;
