"use server";

import { getEnrolledCoursesForUser, getAuthoredCoursesForInstructor, getUserData } from "@/lib/dal";
import { ApiResponses } from "@/utils/apiResponse";
import { CourseCard } from "@/utils/types";

export async function getDashboardData() {
    try {
        const userResult = await getUserData();
        if (!userResult.success || !userResult.data) {
            if (userResult.error?.includes("Unauthorized")) {
                return ApiResponses.unauthorized("You must be logged in to view the dashboard.");
            }
            return ApiResponses.internalServerError(userResult.error ?? "Failed to load dashboard data.");
        }

        const enrolledCoursesResult = await getEnrolledCoursesForUser();
        const enrolledCourses: CourseCard[] = enrolledCoursesResult.success ? (enrolledCoursesResult.data ?? []) : [];

        const authoredCoursesResult = await getAuthoredCoursesForInstructor();
        const authoredCourses: CourseCard[] = authoredCoursesResult.success ? (authoredCoursesResult.data ?? []) : [];

        const data: any = {
            user: {
                ...userResult.data,
                createdAt: userResult.data.createdAt instanceof Date ? userResult.data.createdAt.toISOString() : userResult.data.createdAt,
            },
            enrolledCourses,
            authoredCourses,
        };

        return ApiResponses.success(data);

    } catch (error) {
        return ApiResponses.internalServerError("Failed to load dashboard data.");
    }
}