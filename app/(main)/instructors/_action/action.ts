"use server";

import { z } from "zod";
import { createInstructorProfile, getInstructorById, updateInstructorProfile } from "@/lib/dal";
import { ApiResponse, ApiResponses } from "@/utils/apiResponse";
import { revalidatePath } from "next/cache";

const socialLinkSchema = z.object({
    platform: z.enum(["twitter", "linkedin", "github", "website"]),
    url: z.string().url("Must be a valid URL"),
});

const instructorFormSchema = z.object({
    id: z.string().optional(),
    headline: z.string().min(5, "Headline must be at least 5 characters"),
    bio: z.string().min(20, "Bio must be at least 20 characters"),
    expertise: z.array(z.string().min(1)).min(1, "Add at least one expertise"),
    socialLinks: z.array(socialLinkSchema).optional(),
});

type InstructorFormInput = z.infer<typeof instructorFormSchema>;

export async function createInstructorProfileAction(data: InstructorFormInput) {
    try {
        const validated = instructorFormSchema.safeParse(data);
        if (!validated.success)
            return ApiResponses.badRequest("Invalid input");

        const result = await createInstructorProfile(data);
        if (!result.success) {
            return ApiResponses.internalServerError(result.error ?? "Failed to create profile");
        }
        revalidatePath('/', 'layout');
        return ApiResponses.created(result.data, "Instructor profile created successfully");

    } catch (error) {
        return ApiResponses.internalServerError("Internal server error");
    }
}

export async function updateInstructorProfileAction(data: InstructorFormInput) {
    try {
        const validate = instructorFormSchema.extend({ id: z.string() }).safeParse(data);
        if (!validate.success) {
            return ApiResponses.badRequest("Invalid input");
        }

        let instructorId: string;
        try {
            const instructor = await getInstructorById(data.id!);
            instructorId = instructor.id;
        } catch {
            return ApiResponses.notFound("Instructor not found");
        }

        const result = await updateInstructorProfile({ ...data, id: instructorId });
        if (!result.success) {
            if (result.error?.includes("Forbidden")) {
                return ApiResponses.forbidden(result.error);
            }
            return ApiResponses.internalServerError(result.error ?? "Failed to update profile");
        }
        revalidatePath('/', 'layout');
        return ApiResponses.success(result.data, "Instructor profile updated successfully");

    } catch (error) {
        return ApiResponses.internalServerError("Internal server error");
    }
}
