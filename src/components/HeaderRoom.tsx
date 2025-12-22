"use client";

import { useState } from "react";
import CopyButton from "./CopyButton";
import DestroyButton from "./DestroyButton";
import { formantTimeRemaining, useTtl } from "@/hooks/use-ttl";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface HeaderRoomProps {
  roomId: string;
}

const HeaderRoom = ({ roomId }: HeaderRoomProps) => {
  const router = useRouter();

  const [copyStatus, setCopyStatus] = useState("COPY");
  const { timeRemaining } = useTtl({ roomId });

  return (
    <header className="border-b border-zinc-900 p-4 flex items-center justify-between">
      <div className="flex flex-col items-start gap-2 md:items-center md:flex-row">
        <button
          onClick={() => router.back()}
          className="hover:bg-zinc-900 cursor-pointer rounded-sm"
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
        <DestroyButton id={roomId} />
      </div>
    </header>
  );
};

export default HeaderRoom;
