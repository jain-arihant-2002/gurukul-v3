import type { Metadata } from "next";
import { SITE_URL, absoluteUrl } from "./site";

export const SITE_NAME = "Gurukul";

/** The 1200x630 card rendered by app/opengraph-image.tsx, shared by OpenGraph and Twitter. */
export const SOCIAL_IMAGE = {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: `${SITE_NAME} - online courses and expert instructors`,
};

/**
 * Page-level openGraph/twitter metadata. Page metadata replaces the parent's
 * object rather than deep-merging, so the image has to be repeated here or the
 * file-based card is silently dropped.
 */
export function socialMetadata(input: {
    title: string;
    description: string;
    path: string;
    type?: "website" | "profile";
}): Pick<Metadata, "openGraph" | "twitter"> {
    return {
        openGraph: {
            type: input.type ?? "website",
            siteName: SITE_NAME,
            url: input.path,
            title: input.title,
            description: input.description,
            locale: "en_US",
            images: [SOCIAL_IMAGE],
        },
        twitter: {
            card: "summary_large_image",
            title: input.title,
            description: input.description,
            images: [SOCIAL_IMAGE],
        },
    };
}

/** Brand-first description reused wherever a page has nothing more specific. */
export const DEFAULT_DESCRIPTION =
    "Gurukul is an online learning platform with courses taught by expert instructors. Browse Gurukul courses, meet the instructors, and start learning today.";

// Titles are written as absolutes: each one carries the brand exactly once, so
// the layout's "%s | Gurukul" template never produces "Gurukul Courses | Gurukul".
export const HOME_TITLE = "Gurukul — Online Courses and Expert Instructors";
export const COURSES_TITLE = "Gurukul Courses — Browse Online Courses";

export type JsonLdObject = Record<string, unknown>;

export const organizationJsonLd = (): JsonLdObject => ({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
});

export const websiteJsonLd = (): JsonLdObject => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
});

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdObject {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.path),
        })),
    };
}

export function itemListJsonLd(
    name: string,
    items: { name: string; path: string }[],
    itemType: "Course" | "Person" = "Course"
): JsonLdObject {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name,
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": itemType,
                name: item.name,
                url: absoluteUrl(item.path),
            },
        })),
    };
}
