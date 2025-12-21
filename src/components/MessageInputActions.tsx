"use client";

import { EMOJI } from "@/constants";
import { useState } from "react";
import { PiGifFill } from "react-icons/pi";
import ActionPopover from "./ActionPopover";
import { RiEmojiStickerFill } from "react-icons/ri";

interface MessageInputActionsProps {
  onEmojiSelect: (newValue: string) => void;
}

const MessageInputActions = ({ onEmojiSelect }: MessageInputActionsProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [randomEmoji, setRandomEmoji] = useState<string>(EMOJI[0].items[0]);
  const [selectedTab, setSelectedTab] = useState<string>("GIFs");

  const handleMouseEnter = () => {
    const emojiList = EMOJI[0].items;
    setRandomEmoji(emojiList[Math.floor(Math.random() * emojiList.length)]);
  };

  const handleOpen = (tab: string) => {
    setIsOpen((prev) => !prev);
    setSelectedTab(tab);
  };

  return (
    <div className="relative flex items-center gap-3">
      <button
        className="group cursor-pointer hover:bg-zinc-800 rounded-lg size-8 transition-colors flex items-center justify-center"
        onMouseEnter={handleMouseEnter}
        onClick={() => handleOpen("GIFs")}
      >
        <PiGifFill className="size-5.5 transition-transform group-hover:animate-wiggle" />
      </button>

      <button
        className="group cursor-pointer hover:bg-zinc-800 rounded-lg size-8 transition-colors flex items-center justify-center"
        onMouseEnter={handleMouseEnter}
        onClick={() => handleOpen("Stickers")}
      >
        <RiEmojiStickerFill className="size-5.5 transition-transform group-hover:animate-wiggle" />
      </button>
      <button
        className="group transition-all cursor-pointer size-8 hover:scale-110 hover:bg-zinc-800 rounded-lg"
        onMouseEnter={handleMouseEnter}
        onClick={() => handleOpen("Emoji")}
      >
        <div className="text-xl">{randomEmoji}</div>
      </button>

      {isOpen && (
        <ActionPopover
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          onEmojiSelect={onEmojiSelect}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
};

export default MessageInputActions;
