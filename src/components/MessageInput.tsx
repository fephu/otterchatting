"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import ImagePreviewer from "./ImagePreviewer";
import { PreviewImage } from "@/types";
import MessageInputActions from "./MessageInputActions";
import { useAuthStore } from "@/stores/useAuthStore";
import { useApiCall } from "@/hooks/use-api";
import { baseApi } from "@/lib/client";

interface MessageInputProps {
  roomId: string;
}

const MessageInput = ({ roomId }: MessageInputProps) => {
  const { user } = useAuthStore();
  const { apiCall } = useApiCall();

  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [imagesPreview, setImagesPreview] = useState<PreviewImage[]>([]);

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({
      text,
      images,
    }: {
      text: string;
      images?: string[];
    }) => {
      await apiCall(() =>
        baseApi.api.messages.post({
          sender: user?.username ?? "anonymous",
          text,
          images: images && undefined,
          roomId,
        })
      );

      setInput("");

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }, 0);
    },
  });

  const removeImagesPreview = (id: string) => {
    setImagesPreview((prev) => {
      const target = prev.find((x) => x.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    const el = textareaRef.current;

    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;

    setInput((prev) => {
      const next = prev.slice(0, start) + emoji + prev.slice(end);

      requestAnimationFrame(() => {
        const node = textareaRef.current;
        if (!node) return;

        node.focus();
        const pos = start + emoji.length;
        node.setSelectionRange(pos, pos);
      });

      return next;
    });
  };

  useEffect(() => {
    return () => {
      imagesPreview.forEach((url) => URL.revokeObjectURL(url.previewUrl));
    };
  }, [imagesPreview]);

  return (
    <div className="flex flex-col gap-3">
      {imagesPreview.length > 0 && (
        <div className="flex items-center gap-6 bg-zinc-900/90 p-4 overflow-x-auto">
          {imagesPreview.map((image) => (
            <ImagePreviewer
              id={image.id}
              url={image.previewUrl}
              key={image.id}
              removing={removeImagesPreview}
            />
          ))}
        </div>
      )}
      <div className="flex items-start gap-2 border border-zinc-800 pl-4 pr-2 py-2">
        <div className="flex items-center p-1">
          <button>
            <GoPlus className="text-gray-400 size-6" />
          </button>
        </div>
        <textarea
          ref={textareaRef}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && input.trim()) {
              e.preventDefault();
              sendMessage({ text: input, images: [] });
              textareaRef.current?.focus();
            }
          }}
          onPaste={(e) => {
            const items = e.clipboardData.items;

            for (const item of items) {
              if (item.type.startsWith("image/")) {
                e.preventDefault();

                const file = item.getAsFile();
                if (!file) continue;

                const previewUrl = URL.createObjectURL(file);

                setImagesPreview((prev) => [
                  ...prev,
                  { id: crypto.randomUUID(), file, previewUrl },
                ]);
              }
            }
          }}
          value={input}
          placeholder="Type message..."
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          autoFocus
          className="w-full pt-1.5 focus:outline-none bg-transparent text-zinc-100 placeholder:text-zinc-600 text-sm resize-none"
        />
        <MessageInputActions onEmojiSelect={handleEmojiSelect} />
      </div>
    </div>
  );
};

export default MessageInput;
