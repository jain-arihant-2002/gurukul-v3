// In: app/dashboard/_actions/actions.ts
"use server";

import { getAuth } from "@/lib/auth/session";
import { db } from "@/db/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ApiResponses } from "@/utils/apiResponse";
import { CourseCard, UserRole } from "@/utils/types";
import { getEnrolledCoursesForUser, getAuthoredCoursesForInstructor } from "@/lib/dal";

export async function getDashboardData() {
    const { user: sessionUser, isAuthenticated } = await getAuth();

    if (!isAuthenticated || !sessionUser) {
        return ApiResponses.unauthorized("You must be logged in to view the dashboard.");
    }

    try {
        let coursesPromise: Promise<CourseCard[]>;

        if (sessionUser.role === UserRole.INSTRUCTOR) {
            coursesPromise = getAuthoredCoursesForInstructor(sessionUser.id);
        } else {
            coursesPromise = getEnrolledCoursesForUser(sessionUser.id);
        }
        
        // Fetch user details and the determined course list in parallel
        const [userData, coursesData] = await Promise.all([
            db.query.user.findFirst({
                where: eq(user.id, sessionUser.id),
                columns: { name: true, email: true, image: true, createdAt: true },
            }),
            coursesPromise
        ]);

        if (!userData) {
            return ApiResponses.notFound("User data not found.");
        }
        
        const data = {
            user: {
                ...userData,
                createdAt: userData.createdAt.toISOString()
            },
            // The key name is generic, but the data source is now role-dependent
            enrolledCourses: coursesData,
        };

        return ApiResponses.success(data);

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return ApiResponses.internalServerError("Failed to load dashboard data.");
    }
}