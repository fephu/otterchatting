"use client";

import { EMOJI, TABS } from "@/constants";

interface ActionPopoverProps {
  selectedTab: string;
  setSelectedTab: (newValue: string) => void;
  setIsOpen: (newValue: boolean) => void;
  onEmojiSelect: (newValue: string) => void;
}

const ActionPopover = ({
  setIsOpen,
  onEmojiSelect,
  selectedTab,
  setSelectedTab,
}: ActionPopoverProps) => {
  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      <div className="absolute bottom-full mb-5 right-0 z-20 bg-zinc-900/90 border border-zinc-800 pl-2 pb-4 w-[28rem]">
        <div className="flex items-center gap-2 py-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm cursor-pointer ${
                selectedTab === tab
                  ? "bg-zinc-800 text-zinc-200"
                  : "bg-transparent hover:bg-zinc-800 hover:text-zinc-200"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {selectedTab === "Emoji" && (
          <div
            className="
              overflow-y-auto w-full overflow-x-hidden
              pl-1
              h-full max-h-96
                      
              scrollbar-thin
              scrollbar-track-transparent
              scrollbar-thumb-zinc-700
              hover:scrollbar-thumb-zinc-600
            "
          >
            {EMOJI.map((category, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <h3 className="text-sm font-semibold text-zinc-500 mb-2">
                  {category.label}
                </h3>
                <div className="grid grid-cols-9">
                  {category.items.map((emoji, emojiIndex) => (
                    <button
                      key={emojiIndex}
                      className="text-4xl hover:bg-zinc-700 p-0.5 cursor-pointer flex items-center justify-center"
                      onClick={() => handleEmojiClick(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ActionPopover;
