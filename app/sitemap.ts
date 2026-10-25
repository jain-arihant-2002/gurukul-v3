import type { MetadataRoute } from "next";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db/db";
import { courses, instructors, user } from "@/db/schema";
import { absoluteUrl } from "@/lib/site";
import { tryCatch } from "@/utils/trycatch";

// Course/instructor data changes on request, not at build time: render the
// sitemap fresh so newly published courses appear without a redeploy.
export const dynamic = "force-dynamic";

const COURSES_PER_PAGE = 12;
const INSTRUCTORS_PER_PAGE = 16;

// Public, indexable, non-redirecting pages with no dynamic segments.
const STATIC_PATHS = ["/", "/about", "/contact", "/teacher"] as const;

/** /courses and /instructors 3xx-redirect, so only the /page/1 forms are listed. */
function paginated(path: string, totalPages: number): MetadataRoute.Sitemap {
    return Array.from({ length: Math.max(1, totalPages) }, (_, index) => ({
        url: absoluteUrl(`${path}/${index + 1}`),
    }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [courseRows, instructorRows] = await Promise.all([
        tryCatch(
            db
                .select({ slug: courses.slug, updatedAt: courses.updatedAt })
                .from(courses)
                .where(eq(courses.status, "published"))
        ),
        tryCatch(
            db
                .select({ username: user.username, updatedAt: instructors.updatedAt })
                .from(instructors)
                .innerJoin(user, eq(instructors.id, user.id))
                .where(and(eq(user.role, "instructor"), gt(instructors.coursesCount, 0)))
        ),
    ]);

    if (courseRows.error) console.error("sitemap: failed to load course slugs", courseRows.error);
    if (instructorRows.error) console.error("sitemap: failed to load instructor usernames", instructorRows.error);

    const courseSlugs = courseRows.data ?? [];
    const instructorUsernames = instructorRows.data ?? [];

    return [
        ...STATIC_PATHS.map((path) => ({ url: absoluteUrl(path) })),
        ...paginated("/courses/page", Math.ceil(courseSlugs.length / COURSES_PER_PAGE)),
        ...paginated("/instructors/page", Math.ceil(instructorUsernames.length / INSTRUCTORS_PER_PAGE)),
        ...courseSlugs.map((course) => ({
            url: absoluteUrl(`/courses/${course.slug}`),
            lastModified: course.updatedAt,
        })),
        ...instructorUsernames.map((instructor) => ({
            url: absoluteUrl(`/instructors/${instructor.username}`),
            lastModified: instructor.updatedAt,
        })),
    ];
}
