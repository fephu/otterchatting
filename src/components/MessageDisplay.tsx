"use client";

import { Message } from "@/lib/realtime";
import { useAuthStore } from "@/stores/useAuthStore";
import { format } from "date-fns";

interface MessageDisplayProps {
  msg: Message;
}

const MessageDisplay = ({ msg }: MessageDisplayProps) => {
  const { user } = useAuthStore();

  const renderTextWithEmoji = (text: string) => {
    const emojiRegex = /([\p{Emoji_Presentation}\p{Extended_Pictographic}]+)/gu;
    const parts = text.split(emojiRegex);

    return parts.map((part, index) => {
      if (part.match(emojiRegex)) {
        return (
          <span key={index} className="text-xl inline-block">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col items-start">
      <div className="max-w-[80%] group">
        <div className="flex items-baseline gap-3 mb-1">
          <span
            className={`text-sm tracking-tight font-semibold ${
              msg.sender === user?.username ? "text-green-500" : "text-blue-500"
            }`}
          >
            {msg.sender === user?.username ? user?.username : msg.sender}
          </span>

          <span className="text-[11px] text-zinc-600">
            {format(msg.timestamp, "HH:mm")}
          </span>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed break-all">
          {renderTextWithEmoji(msg.text)}
        </p>
      </div>
    </div>
  );
};

export default MessageDisplay;
