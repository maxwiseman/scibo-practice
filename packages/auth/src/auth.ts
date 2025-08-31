import { db } from "@scibo/db/client";
import { oAuthProxy } from "better-auth/plugins";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "../env";
import { expo } from "@better-auth/expo";

export const config = {
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  secret: env.AUTH_SECRET,
  plugins: [oAuthProxy(), expo()],
  socialProviders: {
    discord: {
      clientId: env.AUTH_DISCORD_ID,
      clientSecret: env.AUTH_DISCORD_SECRET,
      redirectURI: "http://localhost:3000/api/auth/callback/discord",
    },
  },
  trustedOrigins: ["exp://"],
} satisfies BetterAuthOptions;

export const auth = betterAuth(config);
export type Session = typeof auth.$Infer.Session;
