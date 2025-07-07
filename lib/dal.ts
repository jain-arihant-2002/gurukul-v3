import { getCourseBySlugFromDb, getPublishedCourseCardFromDb, getPublishedInstructorCardFromDb, getTotalCoursesCountFromDb, getTotalInstructorsCountFromDb, getInstructorByUsernameFromDb, createCourseInDb, updateCourseInDb, getCourseByIdFromDb } from "@/lib/data/queries"
import { nanoid } from "nanoid";
import { cache } from "react";
import { sanitize } from "./security";
import { CourseFormData, CreateCourseDbInput } from "@/utils/types";

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

export const createCourse = cache(async (courseData: CourseFormData, userId: string) => {
    const courseDbInput: CreateCourseDbInput = {
        ...courseData,
        id: `course_${nanoid()}`,
        longDescriptionHtml: sanitize(courseData.longDescriptionHtml),
        authorId: userId,
        slug: courseData.slug.toLowerCase(),
        price: Number(courseData.price) || 0, // Ensure price is a number  
    }

    const result = await createCourseInDb(courseDbInput);
    return result;
})

export const updateCourse = cache(async (courseData: CourseFormData, userId: string, courseId: string) => {
    const courseDbInput = {
        ...courseData,
        longDescriptionHtml: sanitize(courseData.longDescriptionHtml),
        authorId: userId,
        slug: courseData.slug.toLowerCase(),
        price: Number(courseData.price) || 0, // Ensure price is a number  
    }

    const result = await updateCourseInDb(courseDbInput, courseId);
    return result;
})

