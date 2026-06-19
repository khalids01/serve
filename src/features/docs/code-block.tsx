"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { createHighlighter, type Highlighter } from "shiki";
import { cn } from "@/lib/utils";

interface Props {
  code: string;
  language?: string;
  id?: string;
  className?: string;
}

const SUPPORTED_LANGS = new Set([
  "json",
  "bash",
  "javascript",
  "typescript",
  "shell",
  "text",
]);

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: ["json", "bash", "javascript", "typescript"],
    });
  }
  return highlighterPromise;
}

function normalizeLanguage(language: string) {
  if (language === "shell" || language === "text") return "bash";
  if (SUPPORTED_LANGS.has(language)) return language;
  return "bash";
}

export function CodeBlock({
  code,
  language = "bash",
  className,
}: Props) {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState<string | null>(null);

  const lang = useMemo(() => normalizeLanguage(language), [language]);
  const theme = resolvedTheme === "dark" ? "github-dark" : "github-light";

  useEffect(() => {
    let cancelled = false;

    async function highlight() {
      try {
        const highlighter = await getHighlighter();
        const highlighted = highlighter.codeToHtml(code, { lang, theme });
        if (!cancelled) setHtml(highlighted);
      } catch {
        if (!cancelled) setHtml(null);
      }
    }

    void highlight();
    return () => {
      cancelled = true;
    };
  }, [code, lang, theme]);

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
    <div className={cn("group relative", className)}>
      <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
            {language}
          </span>
          <button
            type="button"
            onClick={() => void onCopy()}
            className="rounded p-1.5 text-zinc-400 opacity-0 transition-opacity hover:bg-zinc-800 hover:text-zinc-100 group-hover:opacity-100"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {html ? (
          <div
            className="overflow-x-auto p-4 text-sm [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!text-sm"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="overflow-x-auto p-4 text-sm text-zinc-100">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
