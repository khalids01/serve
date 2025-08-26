export interface LandingData {
  projectName: string
  tagline: string
  features: string[]
  stats: {
    storageCapacity: string
    filesStored: number
    activeConnections: number
    githubStats: {
      stars: number
      forks: number
      contributors: number
    }
  }
}

export async function getLandingData(): Promise<LandingData> {
  // In a real implementation, this would fetch from your database or external APIs
  // For now, return mock data with fallbacks
  
  try {
    // Simulate fetching GitHub stats (replace with actual GitHub API call)
    const githubStats = {
      stars: 1247,
      forks: 89,
      contributors: 23
    }

    // Simulate fetching server stats from database
    const serverStats = {
      storageCapacity: "2.4 TB",
      filesStored: 15420,
      activeConnections: 142
    }

    return {
      projectName: "Serve - Open Source File Storage",
      tagline: "Fast, secure, and scalable file storage server",
      features: [
        "High Performance",
        "Open Source", 
        "Self-Hosted",
        "API-First",
        "Multi-Tenant",
        "Secure by Default"
      ],
      stats: {
        ...serverStats,
        githubStats
      }
    }
  } catch (error) {
    // Return fallback data if fetching fails
    return {
      projectName: "Serve - Open Source File Storage",
      tagline: "Fast, secure, and scalable file storage server",
      features: [
        "High Performance",
        "Open Source", 
        "Self-Hosted",
        "API-First"
      ],
      stats: {
        storageCapacity: "∞",
        filesStored: 0,
        activeConnections: 0,
        githubStats: {
          stars: 0,
          forks: 0,
          contributors: 0
        }
      }
    }
  }
}
