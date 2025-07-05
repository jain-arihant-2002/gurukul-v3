import { redirect } from "next/navigation";
import { getCourseBySlug } from "@/lib/dal";
import { CourseLevel, CourseStatus } from "@/utils/types";
import EditCourseClient from "./EditCourseClient";
import { getAuth } from "@/lib/auth/session";

type CourseFormData = {
    title: string;
    slug: string;
    shortDescription: string;
    longDescriptionHtml: string;
    price: string;
    language: string;
    level: CourseLevel;
    status: CourseStatus;
    categories: string[];
    whatWillYouLearn: string[];
    prerequisites?: string[];
    coverImageUrl?: string;
    updatedAt: string;
};

export default async function EditCoursePage({ params }: { params: { slug: string } }) {
    // Require user and check role
    const { isAuthenticated, isAdmin, isInstructor } = await getAuth();

    if (!isAuthenticated)
        redirect('/sign-in');

    if (!isAdmin && !isInstructor) {
        redirect('/not-found');
    }
    const course = await getCourseBySlug(params.slug);

    if (!course) {
        redirect('/not-found')

    }

    const formData: CourseFormData = {
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
        coverImageUrl: course.coverImageUrl || "",
        updatedAt: course.updatedAt
    };

    return <EditCourseClient initialData={formData} />;
}