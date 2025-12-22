"use client";

import { formantTimeRemaining, useTtl } from "@/hooks/use-ttl";
import Link from "next/link";

interface RoomItemProps {
  id: string;
  owner: string;
  connected: string[];
}

const RoomItem = ({ id, owner, connected }: RoomItemProps) => {
  const { timeRemaining } = useTtl({ roomId: id });

  return (
    <Link
      href={`/home/room/${id}`}
      className="h-40 border border-zinc-900 bg-zinc-900 py-4 pl-4 pr-2 space-y-2 text-zinc-400"
    >
      <div className="flex gap-1">
        id: <span className="text-green-600 truncate">{id}</span>
      </div>
      <p className="text-sm">owner: {owner}</p>
      <p className="text-sm">{connected.length} members</p>

      <span
        className={`text-sm font-bold flex items-center gap-2 ${
          timeRemaining !== null && timeRemaining < 60
            ? "text-red-500"
            : "text-amber-500"
        }`}
      >
        {timeRemaining !== null ? formantTimeRemaining(timeRemaining) : "--:--"}
      </span>
    </Link>
  );
};

export default RoomItem;
