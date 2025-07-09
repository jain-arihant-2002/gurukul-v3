import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        BETTER_AUTH_SECRET: z.string(),
        DATABASE_URL: z.string().url().min(1, "DATABASE_URL must be a valid URL"),
        GITHUB_CLIENT_ID: z.string().min(1, "GITHUB_CLIENT_ID must be a valid string"),
        GITHUB_CLIENT_SECRET: z.string().min(1, "GITHUB_CLIENT_SECRET must be a valid string"),
        BETTER_AUTH_URL: z.string().url().min(1, "BETTER_AUTH_URL must be a valid URL"),
        GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID must be a valid string"),
        GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_ID must be a valid string"),
        STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required."),
        STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET is required."),
    },
    client: {
        NEXT_PUBLIC_APP_URL: z.string().url().min(1, "NEXT_PUBLIC_APP_URL must be a valid URL"),
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required."),
    },
    // For Next.js >= 13.4.4, you only need to destructure client variables:
    experimental__runtimeEnv: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    }
});