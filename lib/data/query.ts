import { cache } from "react";
import { courses, instructors, lectures, sections, user } from "@/db/schema";
import { db } from "../../db/db";
import { CourseCard, CourseDetails, CourseLevel, InstructorCard, InstructorDetails, LectureType } from "@/utils/types";
import { and, count, desc, eq, gt, sql } from "drizzle-orm";
import { tryCatch } from "@/utils/trycatch";

export const getPublishedCourseCardFromDb = cache(async (options: { limit?: number, offset?: number }): Promise<CourseCard[]> => {
    const { limit, offset } = options;
    const query = db.select({
        id: courses.id,
        slug: courses.slug,
        title: courses.title,
        coverImageUrl: courses.coverImageUrl,
        categories: courses.categories,
        price: courses.price,
        rating: courses.rating,
        level: courses.level,
        authorName: user.name,
        updatedAt: courses.updatedAt,
        createdAt: courses.createdAt,
        enrollmentCount: courses.enrollmentCount
    }).from(courses)
        .innerJoin(instructors, eq(courses.authorId, instructors.id))
        .innerJoin(user, eq(instructors.id, user.id))
        .where(eq(courses.status, "published"))
        .orderBy(desc(courses.updatedAt));

    if (limit && limit > 0) query.limit(limit);
    if (offset && offset > 0) query.offset(offset);

    const { data, error } = await tryCatch(
        query.then(result =>
            result.map((course) => ({
                ...course,
                price: parseFloat(course.price),
                rating: parseFloat(course.rating),
                updatedAt: course.updatedAt.toISOString(),
                createdAt: course.createdAt instanceof Date ? course.createdAt.toISOString() : course.createdAt,
                level: course.level as CourseLevel
            }))
        )
    );
    if (error) {
        console.error("Error in getPublishedCourseCardFromDb:", error);
    }
    return data ?? [];
});

export const getPublishedInstructorCardFromDb = cache(async (options: { limit?: number, offset?: number }): Promise<InstructorCard[]> => {
    const { limit, offset } = options;
    const query = db.select({
        id: instructors.id,
        username: user.username,
        name: user.name,
        avatarUrl: user.image,
        bio: instructors.headline,
        expertise: instructors.expertise,
        coursesCount: sql<number>`(
            SELECT count(*)
            FROM ${courses}
            WHERE ${courses.authorId} = ${user.id} AND ${courses.status} = 'published'
        )::int`.as("courses_count"),
    }).from(instructors)
        .innerJoin(user, eq(instructors.id, user.id))
        .where(and(
            eq(user.role, "instructor"),
            gt(instructors.coursesCount, 0)
        ))
        .orderBy(desc(user.createdAt));

    if (limit && limit > 0) query.limit(limit);
    if (offset && offset > 0) query.offset(offset);

    const { data, error } = await tryCatch(query);
    if (error) {
        console.error("Error in getPublishedInstructorCardFromDb:", error);
    }
    return data ?? [];
});

// export const getAllCoursesFromDb = cache(async (offset?: number) => {
//     const { data, error } = await tryCatch(
//         db.select().from(courses)
//             .innerJoin(sections, eq(courses.id, sections.courseId))
//     );
//     if (error) {
//         console.error("Error in getAllCoursesFromDb:", error);
//     }
//     return data ?? [];
// });

export const getTotalCoursesCountFromDb = cache(async () => {
    const { data, error } = await tryCatch(
        db.select({ count: count().mapWith(Number) })
            .from(courses)
            .where(eq(courses.status, "published"))
            .then(result => result[0]?.count || 0)
    );
    if (error) {
        console.error("Error in getTotalCoursesCountFromDb:", error);
    }
    return data ?? 0;
});

export const getTotalInstructorsCountFromDb = cache(async () => {
    const { data, error } = await tryCatch(
        db.select({ count: count().mapWith(Number) })
            .from(instructors)
            .innerJoin(user, eq(instructors.id, user.id))
            .where(
                and(
                    eq(user.role, "instructor"),
                    gt(instructors.coursesCount, 0),
                )
            )
            .then(result => result[0]?.count || 0)
    );
    if (error) {
        console.error("Error in getTotalInstructorsCountFromDb:", error);
    }
    return data ?? 0;
});


export const getCourseBySlugFromDb = cache(async (slug: string): Promise<CourseDetails | null> => {

    const courseData = await tryCatch(
        db.query.courses.findFirst({
            where: and(
                eq(courses.slug, slug),
                eq(courses.status, "published"),
            ),
            with: {
                author: {
                    with: {
                        user: {
                            columns: {
                                name: true,
                                username: true,
                            }
                        },
                    }

                }
                ,
                sections: {
                    with: {
                        lectures: {
                            with: {
                                quiz: true,
                            },
                        },
                    },
                },
            }
        }
        )
    )
    if (courseData.error) console.log("Error in getCourseBySlugFromDb:", courseData.error);
    if (!courseData.data || courseData.error) return null;

    // Remove author object and add authorName property
    const { author, ...rest } = courseData.data;
    const mod = {
        ...rest,
        authorName: author.user.name,
        authorUsername: author.user.username,
        price: Number(rest.price),
        rating: Number(rest.rating),
        createdAt: rest.createdAt instanceof Date ? rest.createdAt.toISOString() : rest.createdAt,
        updatedAt: rest.updatedAt instanceof Date ? rest.updatedAt.toISOString() : rest.updatedAt,
        sections: rest.sections.map(section => ({
            ...section,
            description: section.description ?? null,
            lectures: section.lectures.map(lecture => ({
                ...lecture,
                type: lecture.type as LectureType,
                quiz: lecture.quiz ?? null,
            })),
        })),
    } as CourseDetails;
    console.log("Course Data:", mod);
    return mod;
});

export const getInstructorByUsernameFromDb = cache(async (username: string): Promise<InstructorDetails | null> => {
    const { data, error } = await tryCatch(
        db.query.user.findFirst({
            where: eq(user.username, username),
            columns: {
                id: true,
                username: true,
                name: true,
                image: true,
            },
            with: {
                instructorProfile: {
                    with: {
                        courses: {
                            columns: {
                                id: true,
                                slug: true,
                                title: true,
                                coverImageUrl: true,
                                categories: true,
                                price: true,
                                rating: true,
                                level: true,
                                updatedAt: true,
                                createdAt: true,
                                enrollmentCount: true

                            }
                        }
                    }
                }

            }
        })

    )
    if (error)
        console.error("Error in getInstructorByUsernameFromDb:", error);
    if (!data || error) return null;

    const { instructorProfile: { courses, ...profile }, ...userData } = data;
    const result: InstructorDetails = {
        ...profile,
        ...userData,
        courses: courses.map(course => ({
            ...course,
            authorName: userData.name,
            price: parseFloat(course.price), // Convert string to number
            rating: parseFloat(course.rating), // Convert string to number
            updatedAt: course.updatedAt instanceof Date ? course.updatedAt.toISOString() : course.updatedAt,
            createdAt: course.createdAt instanceof Date ? course.createdAt.toISOString() : course.createdAt,
            level: course.level as CourseLevel, // Cast to CourseLevel type
        })),
        username: userData.username,
        name: userData.name,
        avatarUrl: userData.image,
        updatedAt: profile.updatedAt instanceof Date ? profile.updatedAt.toISOString() : profile.updatedAt,
        createdAt: profile.createdAt instanceof Date ? profile.createdAt.toISOString() : profile.createdAt,
    }
    console.log("Instructor Data:", result);
    return result;
})
