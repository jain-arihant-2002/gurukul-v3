import { redirect } from "next/navigation";
import { getCourseBySlug } from "@/lib/dal";
import { CourseFormData, CourseLevel, CourseStatus } from "@/utils/types";
import EditCourseClient from "./EditCourseClient";
import { getAuth } from "@/lib/auth/session";



export default async function EditCoursePage({ params }: { params: Promise<{ slug: string }> }) {
    // Require user and check role
    const { isAuthenticated, isAdmin, isInstructor } = await getAuth();

    const { slug } = await params;
    if (!isAuthenticated)
        redirect('/sign-in');

    if (!isAdmin && !isInstructor) {
        redirect('/not-found');
    }
    const course = await getCourseBySlug(slug);

    if (!course) {
        redirect('/not-found')

    }

    const formData: CourseFormData = {
        id: course.id,
        title: course.title,
        slug: course.slug,
        shortDescription: course.shortDescription,
        longDescriptionHtml: course.longDescriptionHtml,
        price: course.price.toString(),
        language: course.language,
        level: course.level as CourseLevel,
        status: course.status as CourseStatus,
        categories: course.categories,
        whatWillYouLearn: course.whatWillYouLearn,
        prerequisites: course.prerequisites || [],
        coverImage: course.coverImage || "",
        createdAt: course.createdAt ? new Date(course.createdAt) : undefined,
        authorId: course.authorId,
        totalDurationHours: course.totalDurationHours

    };

    return <EditCourseClient initialData={formData} />;
}