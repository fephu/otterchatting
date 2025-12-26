"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useApiCall } from "@/hooks/use-api";
import { baseApi } from "@/lib/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const { apiCall } = useApiCall();
  const { user } = useAuthStore();
  const [duration, setDuration] = useState<string>("");

  const { mutate: createRoom, isPending } = useMutation({
    mutationFn: async ({ ttl }: { ttl: number }) => {
      const res = await apiCall(() => baseApi.api.room.create.post({ ttl }));

      if (res.status === 200) {
        router.push(`/home/room/${res.data?.roomId}`);
      }
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const ttl = Number(duration);

    if (ttl <= 0 || !duration) {
      toast.warning("Please select time");
      return;
    }

    createRoom({ ttl });
  };

  return (
    <main className="min-h-screen max-w-xl mx-auto px-4 py-20 space-y-8">
      <div className="flex items-center gap-4">
        <button
          className="hover:bg-zinc-900 size-8 p-1 cursor-pointer"
          onClick={() => router.back()}
        >
          <ChevronLeft className="size-6 text-zinc-400" />
        </button>

        <h1 className="text-2xl md:text-4xl text-green-600 tracking-tight">
          Create your room
        </h1>
      </div>

      <form onSubmit={onSubmit}>
        <div className="space-y-8">
          <div className="flex gap-2 text-zinc-500 text-sm md:text-base">
            <p>Your Identity:</p>
            <p>{user?.username}</p>
          </div>

          <Select onValueChange={(value) => setDuration(value)}>
            <SelectTrigger className="w-full border-zinc-800 text-zinc-300">
              <SelectValue placeholder="Select your room time" />
            </SelectTrigger>
            <SelectContent className="border-zinc-800 text-zinc-300">
              <SelectItem value="600">10 minutes</SelectItem>
              <SelectItem value="1800">30 minutes</SelectItem>
              <SelectItem value="3600">60 minutes</SelectItem>
            </SelectContent>
          </Select>

          <button
            type="submit"
            className="bg-zinc-200 text-zinc-800 hover:bg-zinc-200/70 h-9 px-4 text-sm cursor-pointer flex items-center gap-1"
          >
            Submit
            {isPending && <Spinner className="size-4" />}
          </button>
        </div>
      </form>
    </main>
  );
};

export default Page;
