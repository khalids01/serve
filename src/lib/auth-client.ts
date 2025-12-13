"use client"

import { createAuthClient } from "better-auth/react"
import { adminClient, magicLinkClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    magicLinkClient()
  ],
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ||
        process.env.BETTER_AUTH_URL ||
        "http://localhost:3002"
})

// Infer strictly-typed Session from the client (includes user with plugin-added fields like `role`)
export type Session = typeof authClient.$Infer.Session

export const { signIn, signOut, useSession } = authClient
