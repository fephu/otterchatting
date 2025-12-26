"use client";

import { useApiCall } from "@/hooks/use-api";
import { baseApi } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";

interface DestroyButtonProps {
  id: string;
}

const DestroyButton = ({ id }: DestroyButtonProps) => {
  const { apiCall } = useApiCall();

  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      await apiCall(() =>
        baseApi.api.room.delete(null, { query: { roomId: id } })
      );
    },
  });

  return (
    <button
      onClick={() => destroyRoom()}
      className="text-xs bg-zinc-800 hover:bg-red-600 px-3 py-1.5 text-zinc-400 hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50"
    >
      <span className="group-hover:animate-pulse">💣</span>
      <span className="hidden md:block">DESTROY</span>
    </button>
  );
};

export default DestroyButton;
