// Canonical site origin used by sitemap.xml, robots.txt and absolute metadata URLs.
// Mirrors the resolution order in utils/env.ts but avoids validating the whole
// server env schema just to build a URL.

const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

export const SITE_URL = baseUrl.replace(/\/+$/, "");

/** Build an absolute URL from a site-relative path. */
export const absoluteUrl = (path: string) =>
    `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
