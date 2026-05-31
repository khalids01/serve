"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  src: string;
  placeholderSrc?: string | null;
  alt: string;
  className?: string;
}

export function ProgressiveImage({ src, placeholderSrc, alt, className }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [placeholderFailed, setPlaceholderFailed] = useState(false);

  const showPlaceholder = Boolean(placeholderSrc) && !placeholderFailed;

  return (
    <div className="relative w-full h-full">
      {showPlaceholder && (
        <img
          src={placeholderSrc!}
          alt=""
          aria-hidden
          className={cn(className, "absolute inset-0")}
          onError={() => setPlaceholderFailed(true)}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          className,
          "relative transition-opacity duration-300",
          showPlaceholder && !loaded ? "opacity-0" : "opacity-100",
        )}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
