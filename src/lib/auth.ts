import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { magicLink, admin } from "better-auth/plugins"
import { prisma } from "./prisma"
import { sendMagicLinkEmail } from "./email"
import { env } from "../env"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite"
  }),
  emailAndPassword: {
    enabled: false
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url, token }) => {
        // Better Auth generates an absolute URL based on the incoming request.
        // When running behind a reverse proxy or non-standard port, this can default to localhost.
        // To ensure users receive a link with the correct public origin, rewrite the origin
        // using NEXT_PUBLIC_APP_URL if provided.
        try {
          const appUrl = env.NEXT_PUBLIC_APP_URL
          let finalUrl = url
          if (appUrl) {
            try {
              const targetOrigin = new URL(appUrl)
              const u = new URL(url)
              // Replace origin and explicitly drop any port to avoid leaking proxy port
              u.protocol = targetOrigin.protocol
              u.hostname = targetOrigin.hostname
              // If NEXT_PUBLIC_APP_URL has no port, this clears any port coming from the proxy
              u.port = targetOrigin.port || ""
              finalUrl = u.toString()
            } catch {
              // If URL parsing fails for any reason, fall back to the original url
            }
          }
          await sendMagicLinkEmail(email, finalUrl)
        } catch (e) {
          // Re-throw to let Better Auth propagate the error upstream
          throw e
        }
      },
      // When signup is disabled, Better Auth will only allow magic link sign-in for existing users
      disableSignUp: !env.ENABLE_SIGNUP,
    }),
    admin({
      defaultRole: "user",
      adminUserIds: [] // Add admin user IDs here when needed
    })
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24 * 7 // 7 days
  },
  user: {
    modelName: "User"
  }
})

// Inferred types from Better Auth (includes plugin-augmented fields like `role`)
export type Session = typeof auth.$Infer.Session
export type User = Session["user"]
