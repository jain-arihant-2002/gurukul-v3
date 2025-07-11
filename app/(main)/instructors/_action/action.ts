"use server";

import { z } from "zod";
import { createInstructorProfile, getInstructorById, updateInstructorProfile } from "@/lib/dal";
import { ApiResponse } from "@/utils/apiResponse";
import { getAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

// Zod schema matching the instructor form fields
const socialLinkSchema = z.object({
    platform: z.enum(["twitter", "linkedin", "github", "website"]),
    url: z.string().url("Must be a valid URL"),
});

const instructorFormSchema = z.object({
    id: z.string().optional(), // Only required for update
    headline: z.string().min(5, "Headline must be at least 5 characters"),
    bio: z.string().min(20, "Bio must be at least 20 characters"),
    expertise: z.array(z.string().min(1)).min(1, "Add at least one expertise"),
    socialLinks: z.array(socialLinkSchema).optional(),
});

type InstructorFormInput = z.infer<typeof instructorFormSchema>;

// Create Instructor Profile
export async function createInstructorProfileAction(data: InstructorFormInput) {
    try {
        const { user } = await getAuth();

        if (!user)
            return ApiResponse(null, 401, "Unauthorized: User not authenticated");

        const validated = instructorFormSchema.safeParse(data);

        if (!validated.success)
            return ApiResponse(null, 400, "Invalid input");

        const result = await createInstructorProfile({ ...data, id: user.id });

        if (result.error)
            return ApiResponse(result.data, result.status, result.error);
        revalidatePath('/', 'layout');
        // revalidatePath('/instructors', 'layout');
        return ApiResponse(result, 201, "Instructor profile created successfully");

    } catch (error) {
        console.error("Error creating instructor profile:", error);
        return ApiResponse(null, 500, "Internal server error");
    }
}

// Update Instructor Profile
export async function updateInstructorProfileAction(data: InstructorFormInput) {
    try {
        const { user } = await getAuth();

        if (!user)
            return ApiResponse(null, 401, "Unauthorized: User not authenticated");

        const validate = instructorFormSchema.extend({ id: z.string() }).safeParse(data);

        if (!validate.success) {
            return ApiResponse(null, 400, "Invalid input");
        }

        const instructor = await getInstructorById(user.id);

        const result = await updateInstructorProfile({ ...data, id: instructor.data?.id || '' });
        if (result.error)
            return ApiResponse(result.data, result.status, result.error);
        revalidatePath('/', 'layout');
        // revalidatePath('/instructors', 'layout');
        return ApiResponse(result.data, 200, "Instructor profile updated successfully");

    } catch (error) {
        console.error("Error creating instructor profile:", error);
        return ApiResponse(null, 500, "Internal server error");
    }
}
