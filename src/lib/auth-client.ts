"use client"

import { createAuthClient } from "better-auth/react"
import { adminClient, magicLinkClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    magicLinkClient()
  ],
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003"
})

// Infer strictly-typed Session from the client (includes user with plugin-added fields like `role`)
export type Session = typeof authClient.$Infer.Session

export const { signIn, signOut, useSession } = authClient
