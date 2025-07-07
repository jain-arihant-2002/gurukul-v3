import { cache } from "react";
import { courses, instructors, lectures, sections, user } from "@/db/schema";
import { db } from "../../db/db";
import { CourseCard, CourseDetails, CourseLevel, CreateCourseDbInput, InstructorCard, InstructorDetails, LectureType } from "@/utils/types";
import { and, count, desc, eq, gt, sql } from "drizzle-orm";
import { tryCatch } from "@/utils/trycatch";

export const getPublishedCourseCardFromDb = cache(async (options: { limit?: number, offset?: number }): Promise<CourseCard[]> => {
    const { limit, offset } = options;
    const query = db.select({
        id: courses.id,
        slug: courses.slug,
        title: courses.title,
        coverImage: courses.coverImage,
        categories: courses.categories,
        price: courses.price,
        rating: courses.rating,
        level: courses.level,
        authorName: user.name,
        updatedAt: courses.updatedAt,
        createdAt: courses.createdAt,
        enrollmentCount: courses.enrollmentCount,
        shortDescription: courses.shortDescription,
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
        coursesCount: instructors.coursesCount,
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


export const getCourseBySlugFromDb = cache(async (slug: string, status?: string): Promise<CourseDetails | null> => {
    const whereClause = status
        ? and(eq(courses.slug, slug), eq(courses.status, status as "draft" | "published" | "archived"))
        : eq(courses.slug, slug);

    const courseData = await tryCatch(
        db.query.courses.findFirst({
            where: whereClause,
            with: {
                author: {
                    with: {
                        user: {
                            columns: {
                                name: true,
                                username: true,
                                id: true,
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
    if (courseData.error) console.error("Error in getCourseBySlugFromDb:", courseData.error);
    if (!courseData.data || courseData.error) return null;

    // Remove author object and add authorName property
    const { author, ...rest } = courseData.data;
    const result = {
        ...rest,
        authorId: author.user.id,
        authorName: author.user.name,
        authorUsername: author.user.username,
        price: Number(rest.price),
        rating: Number(rest.rating),
        totalDurationHours: rest.totalDurationHours ?? "", // Use the correct property name
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
    return result;
});

export const getInstructorByUsernameFromDb = cache(async (username: string): Promise<InstructorDetails | null> => {
    const { data, error } = await tryCatch(
        db.query.user.findFirst({
            orderBy: desc(user.createdAt),
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
                                coverImage: true,
                                categories: true,
                                price: true,
                                rating: true,
                                level: true,
                                updatedAt: true,
                                createdAt: true,
                                enrollmentCount: true,
                                shortDescription: true
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
    return result;
})

// export const getUserDataFromDb = cache(async (username: string) => {
//     const { data, error } = await tryCatch(
//         db.query.user.findFirst({
//             where: eq(user.username, username),
//             columns: {
//                 id: true,
//                 username: true,
//                 name: true,
//                 image: true,
//                 email: true,
//                 role: true,
//             }
//         })
//     )
//     if (error) {
//         console.error("Error in getUserDataFromDb:", error);
//     }
//     return data ?? null;
// })
export const createCourseInDb = cache(async (courseData: CreateCourseDbInput) => {
    const { data, error } = await tryCatch(
        db.transaction(async (tx) => {
            // Insert the course
            const inserted = await tx.insert(courses).values({
                ...courseData,
                price: typeof courseData.price === "number"
                    ? courseData.price.toFixed(2)
                    : courseData.price
            }).returning();

            // If published, increment instructor's coursesCount
            if (inserted[0]?.status === "published") {
                await tx.update(instructors)
                    .set({
                        coursesCount: sql`${instructors.coursesCount} + 1`
                    })
                    .where(eq(instructors.id, courseData.authorId));
            }

            return inserted[0];
        })
    );

    if (error) {
        const dbError = error.cause as { code?: string; detail?: string; constraint?: string; message?: string };
        switch (dbError.code) {
            case "23505":
                // Unique violation (e.g., duplicate slug)
                return { error: "A course with this slug already exists.", status: 409, data: null };
            case "23503":
                // Foreign key violation
                return { error: "Invalid author.", status: 400, data: null };
            case "23502":
                // Not null violation
                return { error: "Missing required course field.", status: 422, data: null };
            default:
                // General fallback for other errors
                console.error("Error in createCourseInDb:", error);
                return { error: dbError.detail || dbError.message || "Database error", status: 500, data: null };
        }
    }
    return { data, error: null, status: 201 };

});



export const updateCourseInDb = cache(async (courseData: CreateCourseDbInput, courseId: string) => {
    const currentCourse = await getCourseByIdFromDb(courseId);

    if (!currentCourse) {
        return { error: "Course not found", status: 404, data: null };
    }

    // Use transaction to ensure both course update and count update happen atomically
    const { data, error } = await tryCatch(
        db.transaction(async (tx) => {
            // Update the course
            const updatedCourse = await tx.update(courses)
                .set({
                    ...courseData,
                    price: typeof courseData.price === "number"
                        ? courseData.price.toFixed(2)
                        : courseData.price
                })
                .where(eq(courses.id, courseData.id))
                .returning();

            if (updatedCourse.length === 0) {
                // Throw to ensure tryCatch catches it as an error
                throw new Error("Course update failed");
            }

            const newStatus = updatedCourse[0].status;
            const oldStatus = currentCourse.status;

            // Update instructor's course count based on status change
            if (oldStatus === 'published' && newStatus !== 'published') {
                await tx.update(instructors)
                    .set({
                        coursesCount: sql`${instructors.coursesCount} - 1`
                    })
                    .where(eq(instructors.id, courseData.authorId));
            } else if (oldStatus !== 'published' && newStatus === 'published') {
                await tx.update(instructors)
                    .set({
                        coursesCount: sql`${instructors.coursesCount} + 1`
                    })
                    .where(eq(instructors.id, courseData.authorId));
            }

            return updatedCourse[0];
        })
    );

    if (error) {
        const dbError = error.cause as { code?: string; detail?: string; constraint?: string; message?: string };
        switch (dbError.code) {
            case "23505":
                return { error: "A course with this slug already exists.", status: 409, data: null };
            case "23503":
                return { error: "Invalid author.", status: 400, data: null };
            case "23502":
                return { error: "Missing required course field.", status: 422, data: null };
            default:
                console.error("Error in updateCourseInDb:", error);
                return { error: dbError.detail || dbError.message || "Database error", status: 500, data: null };
        }
    }

    return { data, error: null, status: 200 };
});


export const getCourseByIdFromDb = cache(async (id: string) => {
    const { data, error } = await tryCatch(
        db.query.courses.findFirst({
            where: eq(courses.id, id)
        })
    )
    if (error) {
        console.error("Error in getCourseByIdFromDb:", error);
        return null;
    }
    return data ?? null;
});

export const createInstructorProfileInDb = cache(async (instructorData: Partial<InstructorDetails>) => {
    // Destructure only the fields that will be used
    const {
        id,
        headline,
        bio,
        expertise,
        socialLinks
    } = instructorData;

    // Validate required fields
    if (!id || !headline || !bio) {
        throw new Error("Missing required instructor fields");
    }

    const { data, error } = await tryCatch(
        db.transaction(async (tx) => {
            const insertedInstructor = await tx.insert(instructors).values({
                id,
                headline,
                bio,
                expertise,
                socialLinks: socialLinks ?? [],
            }).returning();

            if (insertedInstructor.length === 0) {
                throw new Error("Instructor profile creation failed");
            }
            // Update user role to instructor
            await tx.update(user)
                .set({ role: "instructor" })
                .where(eq(user.id, id));

            return insertedInstructor[0];
        })
    );
    if (error) {
        const dbError = error.cause as { code?: string; detail?: string; constraint?: string; message?: string };
        switch (dbError.code) {
            case "23505":
                return { error: "You are already a instructor", status: 409, data: null };
            case "23503":
                return { error: "Invalid User.", status: 400, data: null };
            case "23502":
                return { error: "Missing required field.", status: 422, data: null };
            default:
                console.error("Error in updateCourseInDb:", error);
                return { error: dbError.detail || dbError.message || "Database error", status: 500, data: null };
        }
    }

    return { data, error: null, status: 201 };

})

export const updateInstructorProfileInDb = cache(async (instructorData: Partial<InstructorDetails>) => {
    const {
        id,
        headline,
        bio,
        expertise,
        socialLinks
    } = instructorData;

    if (!id) {
        return { error: "Instructor ID is required", status: 400, data: null };
    }

    const { data, error } = await tryCatch(
        db.update(instructors)
            .set({
                headline,
                bio,
                expertise,
                socialLinks: socialLinks ?? [],
            }).where(eq(instructors.id, id)).returning()
    );
    if (error) {
        console.error("Error in updateInstructorProfileInDb:", error);
        return { error: error.message || "Database error", status: 500, data: null };
    }
    return { data: data[0], error: null, status: 200 };
})

export const getInstructorByIdFromDb = cache(async (id: string) => {
    const { data, error } = await tryCatch(
        db.select().from(instructors).where(eq(instructors.id, id))
    );
    if (error)
        return { data: null, error: error.message || "Database error", status: 500 };

    return { data: data[0] || null, error: null, status: 200 };
});