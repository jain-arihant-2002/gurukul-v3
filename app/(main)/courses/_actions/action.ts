"use server";
import { getAuth } from "@/lib/auth/session";
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
});

export async function createCourseAction(formData: CourseFormData) {

    const { user, isAdmin, isInstructor } = await getAuth();

    if (!user || (!isAdmin && !isInstructor))
        return ApiResponses.unauthorized("You must be logged in as an instructor or admin to create a course");

    const validated = courseSchema.safeParse(formData);

    if (!validated.success)
        return ApiResponses.unprocessableEntity("Invalid input");


    // Call DAL function to create the course
    const result = await createCourse(formData, user.id)
    if (result.error) {
        return ApiResponse(result.data, result.status, result.error)
    }
    revalidatePath("/courses", "layout");

    if (result.data?.status === 'published')
        revalidatePath('/instructors', 'layout');

    return ApiResponses.created(result.data, "Course created successfully");
}

export async function updateCourseAction(formData: CourseFormData) {

    const { user, isAdmin, isInstructor } = await getAuth();


    if (!user || (!isAdmin && !isInstructor))
        return ApiResponses.unauthorized("You must be logged in as an instructor or admin to create a course");

    console.log("=== UPDATE COURSE ACTION ===");
    console.log("Form Data:", formData); // Todo : remove this
    if (!formData.id) {
        return ApiResponses.internalServerError("Something went wrong, course ID is missing");
    }

    const course = await getCourseById(formData.id);

    if (!course) {
        return ApiResponses.notFound("Course not found");
    }

    if (!isAdmin && (course.authorId !== user.id))
        return ApiResponses.forbidden("You are not allowed to update this course");

    const validated = courseSchema.safeParse(formData);

    if (!validated.success)
        return ApiResponses.unprocessableEntity("Invalid input");


    // Now perform the update using the course's real id from the DB
    const result = await updateCourse({ ...formData, id: course.id }, user.id, course.id);

    if (result.error) {
        return ApiResponse(result.data, result.status, result.error)
    }

    //This is extremely inefficient, but we need to revalidate the course page and the courses list as stable version don't support revalidationTag .Todo: If stable version supports revalidationTag, we can use that instead
    // After update
    if (
        (result.data?.status === 'published' && course.status !== 'published') //published
        ||
        (result.data?.status !== 'published' && course.status === 'published')//unpublished
    )
        revalidatePath("/courses", "layout");

    revalidatePath("/instructors", "layout");

    return ApiResponse(result.data, 200, "Course created successfully");
}

export async function freeCoursePurchaseAction(courseId: string) {
    const { user } = await getAuth();
    if (!user)
        return ApiResponses.unauthorized("You must be logged in to purchase a course");

    const result = await fulfillCoursePurchase(user.id, courseId, '0.00');

    if (result.error)
        return ApiResponses.internalServerError();
    revalidatePath(`/courses`, 'layout');
    return ApiResponses.success(null, "Course purchased successfully");


}