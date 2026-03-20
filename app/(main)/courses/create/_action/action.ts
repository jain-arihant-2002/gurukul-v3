'use server'

import { upsertSectionsAndLecturesDAL, getCourseById, getSectionsAndLecturesByCourseId } from "@/lib/dal";
import { ApiResponse, ApiResponses } from "@/utils/apiResponse";
import * as z from "zod";
import { revalidatePath } from "next/cache";

const lectureSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Lecture title is required"),
    type: z.enum(["video"]),
    order: z.number(),
    isFreePreview: z.boolean(),
    videoPublicId: z.string().optional(),
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

export async function getSectionsAndLecturesAction(courseId: string) {
    try {
        if (!courseId || typeof courseId !== "string") {
            return ApiResponses.badRequest("Valid course ID is required");
        }

        const course = await getCourseById(courseId);
        if (!course) {
            return ApiResponses.notFound("Course not found.");
        }

        const data = await getSectionsAndLecturesByCourseId(courseId);
        return ApiResponse(data || [], 200, "Sections and lectures fetched successfully");
    } catch (error) {
        return ApiResponses.internalServerError("Failed to fetch course structure");
    }
}

export async function upsertSectionsAndLecturesAction(courseId: string, data: unknown, courseSlug: string) {
    try {
        const validated = formSchema.safeParse(data);
        if (!validated.success) {
            return ApiResponses.unprocessableEntity("Invalid input data");
        }

        if (!courseId || typeof courseId !== "string") {
            return ApiResponses.badRequest("Valid course ID is required");
        }

        const result = await upsertSectionsAndLecturesDAL(courseId, validated.data.sections);

        if (!result.success) {
            if (result.error?.includes("Forbidden")) {
                return ApiResponses.forbidden(result.error);
            }
            if (result.error?.includes("Course not found")) {
                return ApiResponses.notFound(result.error);
            }
            return ApiResponses.internalServerError(result.error ?? "Failed to save sections and lectures");
        }
        revalidatePath(`/`, 'layout');
        revalidatePath(`/courses/${courseSlug}`, 'page');
        return ApiResponse(result, 200, "Sections and lectures saved successfully");

    } catch (error) {
        return ApiResponses.internalServerError("An unexpected error occurred while saving");
    }
}