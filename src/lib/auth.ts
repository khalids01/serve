import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { magicLink, admin } from "better-auth/plugins"
import { prisma } from "./prisma"
import { sendMagicLinkEmail } from "./email"

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
        await sendMagicLinkEmail(email, url)
      }
    }),
    admin({
      defaultRole: "user",
      adminUserIds: [] // Add admin user IDs here when needed
    })
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 // 1 day
  },
  user: {
    modelName: "User"
  }
})

// Inferred types from Better Auth (includes plugin-augmented fields like `role`)
export type Session = typeof auth.$Infer.Session
export type User = Session["user"]
