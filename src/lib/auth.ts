import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink, admin } from "better-auth/plugins";
import { prisma } from "./prisma";
import { sendMagicLinkEmail } from "./email";
import { config } from "@/config";

export const auth = betterAuth({
  baseURL: config.app.url ?? config.app.betterAuthUrl,
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: false,
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url, token }) => {
        try {
          const appUrl = config.app.url;
          let finalUrl = url;
          if (appUrl) {
            try {
              const targetOrigin = new URL(appUrl);
              const u = new URL(url);
              u.protocol = targetOrigin.protocol;
              u.hostname = targetOrigin.hostname;
              u.port = targetOrigin.port || "";
              finalUrl = u.toString();
            } catch {
              // fall back to original url
            }
          }
          await sendMagicLinkEmail(email, finalUrl);
        } catch (e) {
          throw e;
        }
      },
      disableSignUp: !config.auth.enableSignup,
    }),
    admin({
      defaultRole: "user",
      adminUserIds: [],
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24 * 7,
  },
  user: {
    modelName: "User",
  },
  trustedOrigins: [config.app.url ?? "http://localhost:3002"],
});

export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];
