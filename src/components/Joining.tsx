"use client";

import { client, getAuthHeaders } from "@/lib/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Joining = () => {
  const [roomId, setRoomId] = useState<string>("");
  const router = useRouter();

  const { mutate: joinRoom, isPending } = useMutation({
    mutationFn: async () => {
      const res = await client.room.join.post(
        { roomId },
        { headers: getAuthHeaders() }
      );

      if (res.status === 200) {
        router.push(`/room/${res.data?.roomId}`);
      }
    },
  });

  return (
    <div className="flex items-center gap-2">
      <input
        onChange={(e) => setRoomId(e.target.value)}
        className="focus:outline-none text-sm border border-zinc-900 bg-zinc-900 h-10 px-3"
        placeholder="Paste room id"
      />
      <button
        className="border border-zinc-900 bg-zinc-900 px-3 cursor-pointer text-sm h-10"
        onClick={() => joinRoom()}
        disabled={isPending}
      >
        Join
      </button>
    </div>
  );
};

export default Joining;
