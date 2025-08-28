"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  code: string;
  language?: string;
  id?: string;
}

export function CodeBlock({ code, language = "bash" }: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="relative group">
      <pre className="bg-card text-foreground p-4 rounded-lg overflow-x-auto text-sm border">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <button
        onClick={onCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}
