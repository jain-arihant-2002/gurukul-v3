'use server'

import { upsertSectionsAndLecturesDAL, getCourseById, getSectionsAndLecturesByCourseId } from "@/lib/dal";
import { ApiResponse, ApiResponses } from "@/utils/apiResponse";
import * as z from "zod";
import { getAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

// Validation schemas (match client)
const lectureSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Lecture title is required"),
    type: z.enum(["video"]), // Only allow "video" for now
    order: z.number(),
    isFreePreview: z.boolean(),
    videoPublicId: z.string().min(1, "Video public ID is required"),
    // articleContentHtml: z.string().optional(), // Commented for now
});

const sectionSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Section title is required"),
    description: z.string().optional(),
    order: z.number(),
    lectures: z.array(lectureSchema),
});

const formSchema = z.object({
    sections: z.array(sectionSchema).min(1, "At least one section is required"),
});

// Fetch sections and lectures for a course
export async function getSectionsAndLecturesAction(courseId: string) {
    try {
        if (!courseId || typeof courseId !== "string") {
            return ApiResponses.badRequest("Valid course ID is required");
        }

        // Get current user and check permissions
        const { user, isAdmin } = await getAuth();
        if (!user) {
            return ApiResponses.unauthorized("You must be signed in.");
        }

        // Fetch course and check ownership
        const course = await getCourseById(courseId);
        if (!course) {
            return ApiResponses.notFound("Course not found.");
        }
        if ((course.authorId !== user.id) && !isAdmin) {
            return ApiResponses.forbidden("You do not have permission to view this course.");
        }

        const data = await getSectionsAndLecturesByCourseId(courseId);

        return ApiResponse(data || [], 200, "Sections and lectures fetched successfully");
    } catch (error) {
        console.error("Error in getSectionsAndLecturesAction:", error);
        return ApiResponses.internalServerError("Failed to fetch course structure");
    }
}

// Upsert sections and lectures for a course
export async function upsertSectionsAndLecturesAction(courseId: string, data: unknown, courseSlug: string) {
    try {
        const validated = formSchema.safeParse(data);

        if (!validated.success) {
            return ApiResponses.unprocessableEntity("Invalid input data");
        }

        // Validate courseId
        if (!courseId || typeof courseId !== "string") {
            return ApiResponses.badRequest("Valid course ID is required");
        }

        // Get current user
        const { user, isAdmin } = await getAuth();
        if (!user) {
            return ApiResponses.unauthorized("You must be signed in.");
        }

        // Fetch course and check ownership
        const course = await getCourseById(courseId);

        if (!course) {
            return ApiResponses.notFound("Course not found.");
        }
        if ((course.authorId !== user.id) && !isAdmin) {
            return ApiResponses.forbidden("You do not have permission to modify this course.");
        }

        // Upsert sections and lectures
        const result = await upsertSectionsAndLecturesDAL(courseId, validated.data.sections);

        if (!result.success) {
            return ApiResponses.internalServerError(result.error || "Failed to save sections and lectures");
        }
        revalidatePath(`/courses/${courseSlug}`);
        return ApiResponse(result, 200, "Sections and lectures saved successfully");

    } catch (error) {
        console.error("Error in upsertSectionsAndLecturesAction:", error);
        return ApiResponses.internalServerError("An unexpected error occurred while saving");
    }
}