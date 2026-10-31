"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  type BundledLanguage,
  createHighlighter,
  type Highlighter,
  type ThemedToken,
} from "shiki";
import { Button } from "@/components/ui/button";
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
  "tsx",
  "shell",
  "text",
]);

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark"],
      langs: ["json", "bash", "javascript", "typescript", "tsx"],
    });
  }
  return highlighterPromise;
}

function normalizeLanguage(language: string): BundledLanguage {
  if (language === "shell" || language === "text") return "bash";
  if (SUPPORTED_LANGS.has(language)) return language as BundledLanguage;
  return "bash";
}

export function CodeBlock({ code, language = "bash", className }: Props) {
  const [copied, setCopied] = useState(false);
  const [tokens, setTokens] = useState<ThemedToken[][] | null>(null);

  const lang = useMemo(() => normalizeLanguage(language), [language]);

  useEffect(() => {
    let cancelled = false;

    async function highlight() {
      try {
        const highlighter = await getHighlighter();
        const highlighted = highlighter.codeToTokens(code, {
          lang,
          theme: "github-dark",
        }).tokens;
        if (!cancelled) setTokens(highlighted);
      } catch {
        if (!cancelled) setTokens(null);
      }
    }

    void highlight();
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

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
          <Button
            variant="ghost"
            size="icon"
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
          </Button>
        </div>

        <pre className="overflow-x-auto p-4 text-sm text-zinc-100">
          <code>
            {tokens
              ? tokens.map((line) => (
                  <span
                    key={line[0]?.offset ?? `empty-${tokens.indexOf(line)}`}
                  >
                    {line.map((token) => (
                      <span
                        key={token.offset}
                        style={{
                          color: token.color,
                          fontStyle:
                            token.fontStyle && token.fontStyle & 1
                              ? "italic"
                              : undefined,
                          fontWeight:
                            token.fontStyle && token.fontStyle & 2
                              ? "bold"
                              : undefined,
                          textDecoration:
                            token.fontStyle && token.fontStyle & 4
                              ? "underline"
                              : undefined,
                        }}
                      >
                        {token.content}
                      </span>
                    ))}
                    {"\n"}
                  </span>
                ))
              : code}
          </code>
        </pre>
      </div>
    </div>
  );
}
