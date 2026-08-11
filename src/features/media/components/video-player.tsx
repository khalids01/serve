"use client";

import {
  type HLSMimeType,
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
  Poster,
  type VideoMimeType,
} from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
  title: string;
  contentType?: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
}

const VIDEO_MIME_TYPES = new Set<VideoMimeType>([
  "video/mp4",
  "video/webm",
  "video/3gp",
  "video/ogg",
  "video/avi",
  "video/mpeg",
  "video/object",
]);

function playerContentType(contentType: string): VideoMimeType | HLSMimeType {
  if (contentType.includes("mpegurl") || contentType.includes("m3u8")) {
    return "application/vnd.apple.mpegurl";
  }
  if (VIDEO_MIME_TYPES.has(contentType as VideoMimeType)) {
    return contentType as VideoMimeType;
  }
  return "video/mp4";
}

export function VideoPlayer({
  src,
  title,
  contentType = "video/mp4",
  poster,
  autoPlay = false,
  className,
}: VideoPlayerProps) {
  const handleProviderChange = (
    provider: MediaProviderAdapter | null,
    _event: MediaProviderChangeEvent,
  ) => {
    if (isHLSProvider(provider)) {
      provider.library = () => import("hls.js");
    }
  };

  return (
    <MediaPlayer
      title={title}
      src={{ src, type: playerContentType(contentType) }}
      autoPlay={autoPlay}
      playsInline
      crossOrigin
      onProviderChange={handleProviderChange}
      className={cn(
        "aspect-video w-full overflow-hidden rounded-lg bg-black text-white shadow-2xl",
        className,
      )}
    >
      <MediaProvider>
        {poster && (
          <Poster
            src={poster}
            alt={`${title} poster`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity data-[visible]:opacity-100"
          />
        )}
      </MediaProvider>
      <DefaultVideoLayout colorScheme="dark" icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
}
