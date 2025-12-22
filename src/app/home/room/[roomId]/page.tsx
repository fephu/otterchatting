"use client";

import MessageDisplay from "@/components/MessageDisplay";
import { client } from "@/lib/client";
import { useRealtime } from "@/lib/realtime-client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { BiSolidGhost } from "react-icons/bi";
import HeaderRoom from "@/components/HeaderRoom";
import MessageInput from "@/components/MessageInput";
import { useAuthStore } from "@/stores/useAuthStore";

const Page = () => {
  const { token } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const { data: room } = useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      const res = await client.room.get({
        query: { roomId },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return res.data;
    },
    enabled: !!token,
  });

  const { data: messages, refetch } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const res = await client.messages.get({
        query: { roomId },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return res.data;
    },
    enabled: !!token,
  });

  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy"],
    onData: ({ event }) => {
      if (event === "chat.message") {
        refetch();
      }

      if (event === "chat.destroy") {
        router.push("/home");
      }
    },
  });

  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden">
      <HeaderRoom roomId={roomId} />
      <div className="flex flex-1">
        <div className="flex flex-col w-full border-r border-zinc-900">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages?.messages?.length === 0 && (
              <div className="flex py-2 gap-2">
                <BiSolidGhost className="size-4.5" />
                <p className="text-zinc-600 text-sm">
                  No messages yet, start the conversation.
                </p>
              </div>
            )}

            {messages?.messages?.map((msg) => (
              <MessageDisplay key={msg.id} msg={msg} />
            ))}
          </div>
          <div className="px-2 mb-2">
            <MessageInput roomId={roomId} />
          </div>
        </div>

        <div className="hidden md:flex flex-col flex-[0_0_16%] py-4 px-4 gap-4">
          {room?.meta.connected.map((member) => (
            <div key={member} className="text-sm text-zinc-400">
              {member}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Page;
