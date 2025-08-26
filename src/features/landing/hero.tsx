import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getLandingData } from "./data"
import { Github, Star, GitFork, Users, HardDrive, Files, Activity } from "lucide-react"
import Link from "next/link"

export async function Hero() {
  const data = await getLandingData()

  return (
    <section className="container mx-auto py-24 md:py-32">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <Badge variant="outline" className="mx-auto">
            🚀 Open Source File Storage
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {data.projectName.split(' - ')[0]}
          </h1>
          
          <p className="text-xl text-muted-foreground mx-auto max-w-[600px]">
            {data.tagline}. Self-hosted, API-first, and built for developers who need reliable file storage without vendor lock-in.
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-2">
          {data.features.map((feature) => (
            <Badge key={feature} variant="secondary">
              {feature}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-4 text-center">
              <HardDrive className="h-5 w-5 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{data.stats.storageCapacity}</div>
              <div className="text-xs text-muted-foreground">Storage</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Files className="h-5 w-5 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{data.stats.filesStored.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Files</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="h-5 w-5 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{data.stats.activeConnections}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{data.stats.githubStats.stars}</div>
              <div className="text-xs text-muted-foreground">Stars</div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/dashboard">
              Get Started
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" asChild>
            <Link href="https://github.com/your-username/serve" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </Link>
          </Button>
          
          <Button variant="ghost" size="lg" asChild>
            <Link href="/docs">
              Documentation
            </Link>
          </Button>
        </div>

        {/* GitHub Stats */}
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            {data.stats.githubStats.stars} stars
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            {data.stats.githubStats.forks} forks
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {data.stats.githubStats.contributors} contributors
          </div>
        </div>
      </div>
    </section>
  )
}
