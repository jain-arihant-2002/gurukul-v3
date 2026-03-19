import { getCourseBySlugFromDb, getPublishedCourseCardFromDb, getPublishedInstructorCardFromDb, getTotalCoursesCountFromDb, getTotalInstructorsCountFromDb, getInstructorByUsernameFromDb, createCourseInDb, updateCourseInDb, getCourseByIdFromDb, updateInstructorProfileInDb, getInstructorByIdFromDb, createInstructorProfileInDb, fulfillCoursePurchaseInDb, getEnrollmentForUserAndCourseFromDb, getLectureWithCourseIdFromDb, createSectionsAndLecturesInDb, getSectionsAndLecturesByCourseIdFromDb, upsertSectionsAndLecturesInDb, getEnrolledCoursesForUserFromDb, getAuthoredCoursesForInstructorFromDb, getUserDataFromDb, getAllPublishedCourseSlugsFromDb, getAllActiveInstructorUsernamesFromDb } from "@/lib/data/queries"
import { nanoid } from "nanoid";
import { cache } from "react";
import { sanitize } from "./security";
import { CourseFormData, CreateCourseDbInput, Instructor, CourseCard } from "@/utils/types";
import { requireAuth, requireInstructor, requireAdmin, DalResponse, isOwnerOrAdmin } from "./dal/auth";

export const getCoursesCard = cache(async (options: { limit?: number, offset?: number }) => {
    const { limit, offset } = options;
    return limit ? await getPublishedCourseCardFromDb({ limit, offset }) : await getPublishedCourseCardFromDb({});
})

export const getInstructorCard = cache(async (options: { limit?: number, offset?: number }) => {
    const { limit, offset } = options;
    return limit ? await getPublishedInstructorCardFromDb({ limit, offset }) : await getPublishedInstructorCardFromDb({});

})

export const getCoursesCount = cache(async () => {
    const count = await getTotalCoursesCountFromDb();
    return count
})


export const getInstructorsCount = cache(async () => {
    return await getTotalInstructorsCountFromDb()
})


export const getInstructorByUsername = cache(async (username: string) => {
    return await getInstructorByUsernameFromDb(username);
})



export const getCourseById = cache(async (userId: string) => {
    const course = await getCourseByIdFromDb(userId)
    return course;
})

export const getCourseBySlug = cache(async (slug: string, status?: string) => {
    const course = await getCourseBySlugFromDb(slug, status);
    return course ? course : null;
})

export const createCourse = cache(async (courseData: CourseFormData) => {
    try {
        const auth = await requireInstructor();
        const courseDbInput: CreateCourseDbInput = {
            ...courseData,
            id: `course_${nanoid()}`,
            longDescriptionHtml: sanitize(courseData.longDescriptionHtml),
            authorId: auth.userId,
            slug: courseData.slug.toLowerCase(),
            price: Number(courseData.price) || 0,
        }

        const result = await createCourseInDb(courseDbInput);
        if (result.error) {
            return { success: false, data: null, error: result.error };
        }
        return { success: true, data: result.data as Awaited<ReturnType<typeof createCourseInDb>>["data"], error: null };
    } catch (error) {
        return { success: false, data: null, error: error instanceof Error ? error.message : "Failed to create course" };
    }
})

export const updateCourse = cache(async (courseData: CourseFormData, courseId: string) => {
    try {
        const auth = await requireInstructor();
        const existingCourse = await getCourseByIdFromDb(courseId);
        if (!existingCourse) {
            return { success: false, data: null, error: "Course not found" };
        }
        if (!isOwnerOrAdmin(existingCourse.authorId, auth)) {
            return { success: false, data: null, error: "Forbidden: You don't have permission to update this course" };
        }

        const courseDbInput = {
            ...courseData,
            longDescriptionHtml: sanitize(courseData.longDescriptionHtml),
            authorId: existingCourse.authorId,
            slug: courseData.slug.toLowerCase(),
            price: Number(courseData.price) || 0,
        }

        const result = await updateCourseInDb(courseDbInput, courseId);
        if (result.error) {
            return { success: false, data: null, error: result.error };
        }
        return { success: true, data: result.data, error: null };
    } catch (error) {
        return { success: false, data: null, error: error instanceof Error ? error.message : "Failed to update course" };
    }
})


export const createInstructorProfile = cache(async (instructorData: Partial<Instructor>) => {
    try {
        const auth = await requireAuth();
        const newInstructor = await createInstructorProfileInDb({
            id: auth.userId,
            headline: instructorData.headline,
            bio: instructorData.bio,
            expertise: instructorData.expertise,
            socialLinks: instructorData.socialLinks ?? [],
        })
        if (newInstructor.error) {
            return { success: false, data: null, error: newInstructor.error };
        }
        return { success: true, data: newInstructor.data, error: null };
    } catch (error) {
        return { success: false, data: null, error: error instanceof Error ? error.message : "Failed to create instructor profile" };
    }
})


export const updateInstructorProfile = cache(async (instructorData: Partial<Instructor>) => {
    try {
        const auth = await requireAuth();
        const { id, headline, bio, expertise, socialLinks } = instructorData;
        if (!isOwnerOrAdmin(id!, auth)) {
            return { success: false, data: null, error: "Forbidden: You don't have permission to update this profile" };
        }

        const updatedInstructor = await updateInstructorProfileInDb({
            id,
            headline,
            bio,
            expertise,
            socialLinks: socialLinks ?? [],
        });
        if (updatedInstructor.error) {
            return { success: false, data: null, error: updatedInstructor.error };
        }
        return { success: true, data: updatedInstructor.data, error: null };
    } catch (error) {
        return { success: false, data: null, error: error instanceof Error ? error.message : "Failed to update instructor profile" };
    }
})


export const getInstructorById = async (id: string) => {
    const result = await getInstructorByIdFromDb(id);
    if (!result.data)
        throw new Error("Instructor not found");
    return result.data;
}

export const fulfillCoursePurchase = cache(
    async (courseId: string) => {
        try {
            const auth = await requireAuth();
            const course = await getCourseByIdFromDb(courseId);
            if (!course) {
                return { success: false, error: "Course not found." };
            }

            const isEnrolled = await checkUserEnrollment(auth.userId, courseId);
            if (isEnrolled) {
                return { success: false, error: "You are already enrolled in this course." };
            }

            const result = await fulfillCoursePurchaseInDb(auth.userId, courseId, course.price);
            if (result.error) {
                return { success: false, error: "Failed to fulfill purchase." };
            }
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : "Failed to fulfill purchase" };
        }
    }
);

export const fulfillCoursePurchaseInternal = async (userId: string, courseId: string) => {
    try {
        const course = await getCourseByIdFromDb(courseId);
        if (!course) {
            return { success: false, error: "Course not found." };
        }

        const isEnrolled = await checkUserEnrollment(userId, courseId);
        if (isEnrolled) {
            return { success: false, error: "You are already enrolled in this course." };
        }

        const result = await fulfillCoursePurchaseInDb(userId, courseId, course.price);
        if (result.error) {
            return { success: false, error: "Failed to fulfill purchase." };
        }
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to fulfill purchase" };
    }
};


// Function to check if a user is enrolled in a course
export const checkUserEnrollment = cache(async (userId: string, courseId: string) => {
    const enrollment = await getEnrollmentForUserAndCourseFromDb(userId, courseId);
    if (enrollment.error) {
        console.error("DAL Error in checkUserEnrollment:", enrollment.error);
        return null;
    }
    return enrollment.data;
});

export const getLectureWithCourseId = cache(async (lectureId: string) => {
    return await getLectureWithCourseIdFromDb(lectureId);
});

export async function createSectionsAndLecturesDAL(courseId: string, sectionsInput: any[]) {
    return await createSectionsAndLecturesInDb(courseId, sectionsInput);
}
export const getSectionsAndLecturesByCourseId = cache(async (courseId: string) => {
    return await getSectionsAndLecturesByCourseIdFromDb(courseId);
});

export const upsertSectionsAndLecturesDAL = cache(async (courseId: string, sectionsInput: any[]) => {
    try {
        const auth = await requireInstructor();
        const course = await getCourseByIdFromDb(courseId);
        if (!course) {
            return { success: false, error: "Course not found" };
        }
        if (!isOwnerOrAdmin(course.authorId, auth)) {
            return { success: false, error: "Forbidden: You don't have permission to modify this course" };
        }

        if (!courseId || typeof courseId !== "string") {
            return { success: false, error: "Valid course ID is required" };
        }

        if (!sectionsInput || !Array.isArray(sectionsInput) || sectionsInput.length === 0) {
            return { success: false, error: "At least one section is required" };
        }

        const result = await upsertSectionsAndLecturesInDb(courseId, sectionsInput);
        return result;
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
});

export const getEnrolledCoursesForUser = cache(async (): Promise<{ success: boolean; data: CourseCard[] | null; error: string | null }> => {
    try {
        const auth = await requireAuth();
        const courses = await getEnrolledCoursesForUserFromDb(auth.userId);
        return { success: true, data: courses, error: null };
    } catch (error) {
        return { success: false, data: null, error: error instanceof Error ? error.message : "Failed to fetch enrolled courses" };
    }
});

export const getAuthoredCoursesForInstructor = cache(async (): Promise<{ success: boolean; data: CourseCard[] | null; error: string | null }> => {
    try {
        const auth = await requireInstructor();
        const courses = await getAuthoredCoursesForInstructorFromDb(auth.userId);
        return { success: true, data: courses, error: null };
    } catch (error) {
        return { success: false, data: null, error: error instanceof Error ? error.message : "Failed to fetch authored courses" };
    }
});

export const getUserData = cache(async () => {
    try {
        const auth = await requireAuth();
        const data = await getUserDataFromDb(auth.userId);
        return { success: true, data, error: null };
    } catch (error) {
        return { success: false, data: null, error: error instanceof Error ? error.message : "Failed to fetch user data" };
    }
});

export const getAllPublishedCourseSlugs = cache(async () => {
    return await getAllPublishedCourseSlugsFromDb();

});

export const getAllActiveInstructorUsernames = cache(async () => {
    return await getAllActiveInstructorUsernamesFromDb();

});
