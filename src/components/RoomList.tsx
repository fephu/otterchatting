"use client";

import { baseApi } from "@/lib/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import RoomItem from "./RoomItem";
import { Skeleton } from "./ui/skeleton";
import { useApiCall } from "@/hooks/use-api";

const RoomList = () => {
  const { token } = useAuthStore();
  const { apiCall } = useApiCall();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["rooms"],
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await apiCall(() => baseApi.api.room["my-rooms"].get());
      return res.data;
    },
  });

  if (!token) return null;

  if (isLoading) {
    return (
      <div className="flex gap-6 py-4">
        <Skeleton className="h-40 w-80" />
        <Skeleton className="h-40 w-80" />
        <Skeleton className="h-40 w-80" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center py-4 h-40">
        <p className="text-zinc-600">
          Failed to load rooms{error ? `: ${(error as Error).message}` : "."}
        </p>
      </div>
    );
  }

  const rooms = data?.rooms ?? [];

  if (rooms.length === 0) {
    return (
      <div className="flex items-center py-4 h-40">
        <p className="text-zinc-600 text-sm">No rooms available. Create one!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
      {rooms.map((room) => (
        <RoomItem
          key={room.roomId}
          id={room.roomId}
          owner={room.owner}
          connected={room.connected}
        />
      ))}
    </div>
  );
};

export default RoomList;
