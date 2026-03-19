"use server";
import { createCourse, fulfillCoursePurchase, getCourseById, updateCourse } from "@/lib/dal";
import { ApiResponse, ApiResponses } from "@/utils/apiResponse";
import { CourseFormData, CourseLevel, CourseStatus } from "@/utils/types";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const courseSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    shortDescription: z.string().min(10, "Short description must be at least 10 characters").max(200, "Short description must be less than 200 characters"),
    longDescriptionHtml: z.string().min(50, "Long description must be at least 50 characters"),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Price must be a valid number"),
    language: z.string().min(1, "Language is required"),
    level: z.enum(Object.values(CourseLevel) as [string, ...string[]], {
        required_error: "Please select a course level",
    }),
    status: z.enum(Object.values(CourseStatus) as [string, ...string[]], {
        required_error: "Please select a course status",
    }),
    categories: z.array(z.string()).min(1, "At least one category is required"),
    whatWillYouLearn: z.array(z.string()).min(1, "At least one learning outcome is required"),
    prerequisites: z.array(z.string()).optional(),
    coverImage: z.string().optional(),
    totalDurationHours: z.number().min(0, "Total duration must be at least 0"),
});

export async function createCourseAction(formData: CourseFormData) {
    const validated = courseSchema.safeParse(formData);
    if (!validated.success)
        return ApiResponses.unprocessableEntity("Invalid input");

    const result = await createCourse(formData);
    if (!result.success) {
        return ApiResponses.internalServerError(result.error ?? "Unknown error");
    }
    revalidatePath("/", "layout");
    return ApiResponses.created(result.data, "Course created successfully");
}

export async function updateCourseAction(formData: CourseFormData) {
    if (!formData.id) {
        return ApiResponses.internalServerError("Course ID is missing");
    }

    const existingCourse = await getCourseById(formData.id);
    if (!existingCourse || !existingCourse.id) {
        return ApiResponses.notFound("Course not found");
    }

    const validated = courseSchema.safeParse(formData);
    if (!validated.success)
        return ApiResponses.unprocessableEntity("Invalid input");

    const result = await updateCourse({ ...formData, id: existingCourse.id }, existingCourse.id);
    if (!result.success) {
        if (result.error?.includes("Forbidden")) {
            return ApiResponses.forbidden(result.error);
        }
        return ApiResponses.internalServerError(result.error ?? "Unknown error");
    }

    revalidatePath("/", "layout");
    return ApiResponse(result.data, 200, "Course updated successfully");
}

export async function freeCoursePurchaseAction(courseId: string) {
    const result = await fulfillCoursePurchase(courseId);
    if (!result.success) {
        if (result.error?.includes("Unauthorized")) {
            return ApiResponses.unauthorized("You must be logged in to purchase a course");
        }
        return ApiResponses.internalServerError(result.error ?? "Unknown error");
    }
    revalidatePath(`/`, 'layout');
    return ApiResponses.success(null, "Course purchased successfully");
}