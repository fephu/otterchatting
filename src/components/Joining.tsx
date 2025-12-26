"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useApiCall } from "@/hooks/use-api";
import { baseApi } from "@/lib/client";

const Joining = () => {
  const [roomId, setRoomId] = useState<string>("");
  const router = useRouter();
  const { apiCall } = useApiCall();

  const { mutate: joinRoom, isPending } = useMutation({
    mutationFn: async () => {
      const res = await apiCall(() => baseApi.api.room.join.post({ roomId }));

      if (res.status === 200) {
        router.push(`/room/${res.data?.roomId}`);
      }
    },
  });

  const joinning = () => {
    if (roomId === "") {
      toast.warning("Please typing room id to join");
      return;
    }

    joinRoom();
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Paste the room's ID"
        className="text-zinc-200 border border-zinc-900 bg-zinc-900 h-10 px-3"
      />
      <button
        className="border border-zinc-900 bg-zinc-900 hover:bg-zinc-900/60 px-3 cursor-pointer text-sm h-10"
        onClick={joinning}
        disabled={isPending}
      >
        Join
      </button>
    </div>
  );
};

export default Joining;
