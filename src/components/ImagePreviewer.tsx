"use client";

import Image from "next/image";
import { HiOutlineTrash } from "react-icons/hi";

interface ImagePreviewerProps {
  id: string;
  url: string;
  removing: (url: string) => void;
}

const ImagePreviewer = ({ id, url, removing }: ImagePreviewerProps) => {
  return (
    <div className="relative border border-zinc-600 rounded-md">
      <Image
        src={url}
        alt="image preview"
        width={120}
        height={120}
        className="rounded-md"
      />
      <div className="absolute top-0 -right-2 cursor-pointer bg-zinc-800 flex items-center p-1 rounded-sm">
        <button className="cursor-pointer" onClick={() => removing(id)}>
          <HiOutlineTrash className="text-red-800 size-5" />
        </button>
      </div>
    </div>
  );
};

export default ImagePreviewer;
