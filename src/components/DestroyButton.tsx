"use client";

import { client, getAuthHeaders } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";

interface DestroyButtonProps {
  id: string;
}

const DestroyButton = ({ id }: DestroyButtonProps) => {
  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      await client.room.delete(null, {
        query: { roomId: id },
        headers: getAuthHeaders(),
      });
    },
  });

  return (
    <button
      onClick={() => destroyRoom()}
      className="text-xs bg-zinc-800 hover:bg-red-600 px-3 py-1.5 rounded text-zinc-400 hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50"
    >
      <span className="group-hover:animate-pulse">💣</span>
      <span className="hidden md:block">DESTROY NOW</span>
    </button>
  );
};

export default DestroyButton;
