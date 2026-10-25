import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Authenticated, transactional and duplicate entry points. Everything else is
// public marketing/catalog content and stays crawlable.
const PRIVATE_PATHS = [
    "/api/",
    "/dashboard",
    "/sign-in",
    "/sign-up",
    "/courses/create",
    "/courses/*/edit",
    "/courses/*/learn",
    "/courses/*/preview",
    "/courses/*/success",
    "/courses/*/cancelled",
    "/instructors/register",
    "/instructors/*/edit",
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: PRIVATE_PATHS,
            },
        ],
        sitemap: absoluteUrl("/sitemap.xml"),
    };
}
