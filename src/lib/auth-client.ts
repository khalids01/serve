"use client"

import { admin } from "better-auth/plugins"
import { createAuthClient } from "better-auth/react"
import { magicLinkClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [
    admin(),
    magicLinkClient()
  ],
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003"
})

export const { signIn, signOut, useSession } = authClient
