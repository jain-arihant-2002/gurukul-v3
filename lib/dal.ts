import { getCourseBySlugFromDb, getPublishedCourseCardFromDb, getPublishedInstructorCardFromDb, getTotalCoursesCountFromDb, getTotalInstructorsCountFromDb, getInstructorByUsernameFromDb } from "@/lib/data/queries"
import { cache } from "react";

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


// export const getAllCourses = cache(async () => {
//     return await getAllCoursesFromDb()
// })


export const getInstructorsCount = cache(async () => {
    return await getTotalInstructorsCountFromDb()
})

export const getCourseBySlug = cache(async (slug: string,status?:string) => {
    const course = await getCourseBySlugFromDb(slug,status);
    return course ? course : null;
})

export const getInstructorByUsername = cache(async (username: string) => {
    return await getInstructorByUsernameFromDb(username);
})

// export const getUserData = cache(async (username: string) => {
//     const user = getUserDataFromDb(username)
//     return user
// })