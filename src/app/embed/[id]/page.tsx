import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toFileContentUrl } from "@/features/files/lib/file-kind";
import { VideoPlayer } from "@/features/media/components/video-player";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getVideo(id: string) {
  return prisma.image.findUnique({
    where: { id },
    select: {
      id: true,
      filename: true,
      contentType: true,
      applications: {
        select: { applicationId: true, originalName: true },
        orderBy: { linkedAt: "asc" },
      },
    },
  });
}

function videoTitle(
  video: NonNullable<Awaited<ReturnType<typeof getVideo>>>,
  applicationId?: string,
) {
  const application = applicationId
    ? video.applications.find((item) => item.applicationId === applicationId)
    : video.applications[0];
  return (
    application?.originalName ??
    video.applications[0]?.originalName ??
    video.filename
  );
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ app?: string | string[] }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const { app } = await props.searchParams;
  const video = await getVideo(id);
  return {
    title: video
      ? videoTitle(video, typeof app === "string" ? app : undefined)
      : "Video",
    robots: { index: false, follow: false },
  };
}

export default async function VideoEmbedPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ app?: string | string[] }>;
}) {
  const { id } = await props.params;
  const { app } = await props.searchParams;
  const video = await getVideo(id);
  if (!video || !video.contentType.startsWith("video/")) notFound();

  const title = videoTitle(video, typeof app === "string" ? app : undefined);

  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-black">
      <VideoPlayer
        src={toFileContentUrl(video.id)}
        title={title}
        contentType={video.contentType}
        className="h-auto max-h-dvh w-full rounded-none shadow-none"
      />
    </main>
  );
}
