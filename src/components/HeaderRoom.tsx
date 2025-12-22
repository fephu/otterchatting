"use client";

import { useState } from "react";
import CopyButton from "./CopyButton";
import DestroyButton from "./DestroyButton";
import { formantTimeRemaining, useTtl } from "@/hooks/use-ttl";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { GrLogout } from "react-icons/gr";

interface HeaderRoomProps {
  roomId: string;
  isOwner: boolean;
}

const HeaderRoom = ({ roomId, isOwner }: HeaderRoomProps) => {
  const router = useRouter();

  const [copyStatus, setCopyStatus] = useState("COPY");
  const { timeRemaining } = useTtl({ roomId });

  return (
    <header className="border-b border-zinc-900 p-4 flex items-center justify-between">
      <div className="flex flex-col items-start gap-2 md:items-center md:flex-row">
        <button
          onClick={() => router.push("/home")}
          className="hover:bg-zinc-900 cursor-pointer"
        >
          <ChevronLeft className="text-zinc-500 size-6" />
        </button>
        <span className="hidden md:block text-sm text-zinc-500">Room ID:</span>
        <div className="flex flex-col items-start md:flex-row md:items-center gap-2">
          <span className="font-bold text-green-500">{roomId}</span>
          <CopyButton copyStatus={copyStatus} setCopyStatus={setCopyStatus} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`text-sm font-bold flex items-center gap-2 ${
            timeRemaining !== null && timeRemaining < 60
              ? "text-red-500"
              : "text-amber-500"
          }`}
        >
          {timeRemaining !== null
            ? formantTimeRemaining(timeRemaining)
            : "--:--"}
        </span>
        {isOwner ? (
          <DestroyButton id={roomId} />
        ) : (
          <button className="text-xs bg-zinc-800 hover:bg-red-600 px-3 py-1.5 text-zinc-400 hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50">
            <GrLogout className="group-hover:animate-pulse size-4" />
            <span className="hidden md:block">LEAVE</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default HeaderRoom;
