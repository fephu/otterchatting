"use client";

interface CopyButtonProps {
  copyStatus: string;
  setCopyStatus: (newState: string) => void;
}

const CopyButton = ({ copyStatus, setCopyStatus }: CopyButtonProps) => {
  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopyStatus("COPIED!");
    setTimeout(() => setCopyStatus("COPY"), 2000);
  };

  return (
    <button
      onClick={copyLink}
      className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
    >
      {copyStatus}
    </button>
  );
};

export default CopyButton;
