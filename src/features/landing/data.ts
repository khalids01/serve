import { prisma } from "@/lib/prisma";

export interface LandingData {
  projectName: string;
  tagline: string;
  features: string[];
  stats: {
    storageLabel: string;
    filesStored: number;
    applications: number;
    githubStats: {
      stars: number;
      forks: number;
      contributors: number;
    };
  };
}

function formatStorage(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const k = 1024;
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    units.length - 1,
  );
  return `${Number((bytes / k ** index).toFixed(2))} ${units[index]}`;
}

async function fetchGitHubStats() {
  try {
    const response = await fetch("https://api.github.com/repos/khalids01/serve", {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      return { stars: 0, forks: 0, contributors: 0 };
    }
    const data = (await response.json()) as {
      stargazers_count?: number;
      forks_count?: number;
    };
    return {
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
      contributors: 0,
    };
  } catch {
    return { stars: 0, forks: 0, contributors: 0 };
  }
}

async function fetchInstanceStats() {
  try {
    const [imageAgg, variantAgg, applicationCount] = await Promise.all([
      prisma.image.aggregate({
        _count: { id: true },
        _sum: { sizeBytes: true },
      }),
      prisma.imageVariant.aggregate({
        _sum: { sizeBytes: true },
      }),
      prisma.application.count(),
    ]);

    const storageBytes =
      (imageAgg._sum.sizeBytes ?? 0) + (variantAgg._sum.sizeBytes ?? 0);

    return {
      storageLabel: formatStorage(storageBytes),
      filesStored: imageAgg._count.id,
      applications: applicationCount,
    };
  } catch {
    return {
      storageLabel: "0 B",
      filesStored: 0,
      applications: 0,
    };
  }
}

export async function getLandingData(): Promise<LandingData> {
  const [instanceStats, githubStats] = await Promise.all([
    fetchInstanceStats(),
    fetchGitHubStats(),
  ]);

  return {
    projectName: "Serve - Open Source File Storage",
    tagline: "Fast, secure, and scalable file storage server",
    features: [
      "High Performance",
      "Open Source",
      "Self-Hosted",
      "API-First",
      "Multi-Tenant",
      "Secure by Default",
    ],
    stats: {
      ...instanceStats,
      githubStats,
    },
  };
}
