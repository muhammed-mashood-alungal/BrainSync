"use client";

import { useState } from "react";
import { ClipboardCheck, Clipboard } from "lucide-react";

export default function LinkCopyButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span
      onClick={handleCopy}
      className={`text-white hover:underline hover:cursor-pointer flex items-center gap-2`}
    >
      {copied ? (
        <ClipboardCheck className="w-4 h-4 text-green-400" />
      ) : (
        <Clipboard className="w-4 h-4" />
      )}
      {copied ? "Copied!" : "Copy Link"}
    </span>
  );
}
