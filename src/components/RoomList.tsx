"use client";

import { client, getAuthHeaders } from "@/lib/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import RoomItem from "./RoomItem";
import Skeleton from "react-loading-skeleton";

const RoomList = () => {
  const token = useAuthStore((s) => s.token);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["rooms"],
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await client.room["my-rooms"].get({
        headers: getAuthHeaders(),
      });
      return res.data;
    },
  });

  if (!token) return null;

  if (isLoading) {
    return (
      <div className="mt-4">
        <Skeleton className="h-40 w-80 bg-zinc-200" count={1} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-4 flex items-center py-10">
        <p className="text-zinc-600">
          Failed to load rooms{error ? `: ${(error as Error).message}` : "."}
        </p>
      </div>
    );
  }

  const rooms = data?.rooms ?? [];

  if (rooms.length === 0) {
    return (
      <div className="mt-4 flex items-center py-10">
        <p className="text-zinc-600">No rooms available. Create one!</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <RoomItem
            key={room.roomId}
            id={room.roomId}
            owner={room.owner}
            connected={room.connected}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomList;
