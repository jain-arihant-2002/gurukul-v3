import type { JsonLdObject } from "@/lib/seo";

/**
 * Renders schema.org JSON-LD. `<` is escaped so a title containing "</script>"
 * cannot break out of the tag.
 */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
    const json = JSON.stringify(data).replace(/</g, "\\u003c");
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
