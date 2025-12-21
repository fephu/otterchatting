import { client, getAuthHeaders } from "@/lib/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function formantTimeRemaining(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface Props {
  roomId: string;
}

export const useTtl = ({ roomId }: Props) => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const router = useRouter();
  const { token } = useAuthStore();

  const { data: ttlData } = useQuery({
    queryKey: ["ttl", roomId],
    queryFn: async () => {
      const res = await client.room.ttl.get({
        query: { roomId },
        headers: getAuthHeaders(),
      });

      return res.data;
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (ttlData?.ttl !== undefined) {
      setTimeRemaining(ttlData.ttl);
    }
  }, [ttlData]);
  useEffect(() => {
    if (timeRemaining === null || timeRemaining < 0) {
      return;
    }

    if (timeRemaining === 0) {
      router.push("/home");
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, router]);

  return { timeRemaining };
};
