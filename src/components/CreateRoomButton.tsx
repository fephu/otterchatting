"use client";

import { client, getAuthHeaders } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const CreateRoomButton = () => {
  const router = useRouter();

  const { mutate: createRoom, isPending } = useMutation({
    mutationFn: async ({ ttl }: { ttl: number }) => {
      const res = await client.room.create.post(
        { ttl },
        {
          headers: getAuthHeaders(),
        }
      );

      if (res.status === 200) {
        router.push(`/home/room/${res.data?.roomId}`);
      }
    },
  });

  const create = (ttl: number) => {
    createRoom({ ttl });
  };

  return (
    <button
      onClick={() => create(1800)}
      type="button"
      disabled={isPending}
      className="size-8 p-1 rounded-sm text-zinc-300 text-sm hover:bg-zinc-800/90 transition-colors cursor-pointer disabled:opacity-50"
    >
      <Plus className="text-green-600 size-6" />
    </button>
  );
};

export default CreateRoomButton;
