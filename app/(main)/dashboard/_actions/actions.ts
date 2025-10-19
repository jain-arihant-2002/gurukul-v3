// In: app/dashboard/_actions/actions.ts
"use server";

import { getAuth } from "@/lib/auth/session";
import { ApiResponses } from "@/utils/apiResponse";
import { CourseCard, UserRole } from "@/utils/types";
import { getEnrolledCoursesForUser, getAuthoredCoursesForInstructor, getUserData } from "@/lib/dal";

export async function getDashboardData() {
    const { user: sessionUser, isAuthenticated } = await getAuth();

    if (!isAuthenticated || !sessionUser) {
        return ApiResponses.unauthorized("You must be logged in to view the dashboard.");
    }

    try {
        // Prepare promises
        const userPromise = getUserData(sessionUser.id);

        const enrolledCoursesPromise: Promise<CourseCard[]> = getEnrolledCoursesForUser(sessionUser.id);

        const authoredCoursesPromise: Promise<CourseCard[]> =
            sessionUser.role === UserRole.INSTRUCTOR
                ? getAuthoredCoursesForInstructor(sessionUser.id)
                : Promise.resolve([]);

        // Fetch in parallel
        const [userData, enrolledCourses, authoredCourses] = await Promise.all([
            userPromise,
            enrolledCoursesPromise,
            authoredCoursesPromise,
        ]);

        if (!userData) {
            return ApiResponses.notFound("User data not found.");
        }

        const data: any = {
            user: {
                ...userData,
                createdAt: userData.createdAt instanceof Date ? userData.createdAt.toISOString() : userData.createdAt,
            },
            enrolledCourses,
        };

        if (sessionUser.role === UserRole.INSTRUCTOR) {
            data.authoredCourses = authoredCourses;
        }

        return ApiResponses.success(data);

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return ApiResponses.internalServerError("Failed to load dashboard data.");
    }
}