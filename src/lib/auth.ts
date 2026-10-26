import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, emailOTP } from "better-auth/plugins";
import { config } from "@/config";
import { sendSignInOTPEmail } from "./email";
import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: config.app.url ?? config.app.betterAuthUrl,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? { github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          disableSignUp: !config.auth.enableSignup,
        } }
      : {}),
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await sendSignInOTPEmail(email, otp);
      },
      otpLength: 6,
      expiresIn: 600,
      allowedAttempts: 3,
      storeOTP: "hashed",
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
