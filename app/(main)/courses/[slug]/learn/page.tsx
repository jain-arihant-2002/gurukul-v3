// In: app/(learn)/courses/[slug]/page.tsx
import { getAuth } from "@/lib/auth/session";
import { getCourseBySlug, checkUserEnrollment } from "@/lib/dal";
import { redirect } from "next/navigation";
import { CoursePlayerClient } from "./_components/CoursePlayerClient";
import { getCloudinaryVideoUrl } from "@/utils/helperFunctions";

export default async function CoursePlayerPage({ params }: { params: { slug: string } }) {
    // 1. Fetch user authentication and course data
    const { user, isAuthenticated } = await getAuth();
    const course = await getCourseBySlug(params.slug);

    // 2. Basic Validation
    if (!course) {
        redirect("/courses");
    }

    if (!isAuthenticated || !user) {
        // Redirect to sign-in, with a callback to this page after login
        redirect(`/sign-in?callbackUrl=/learn/courses/${params.slug}`);
    }

    // 3. CRITICAL: Authorization Check
    const isEnrolled = await checkUserEnrollment(user.id, course.id);

    if (!isEnrolled) {
        redirect(`/courses/${params.slug}`);
    }

    const courseWithVideoUrls = {
        ...course,
        sections: (course.sections ?? []).map(section => ({
            ...section,
            lectures: (section.lectures ?? []).map(lecture => ({
                ...lecture,
                // Only add a videoUrl if it's a video and has a publicId
                videoUrl: lecture.type === 'video' && lecture.videoPublicId
                    ? getCloudinaryVideoUrl(lecture.videoPublicId)
                    : undefined,
            }))
        }))
    };

    // 4. If all checks pass, render the client component with the course data
    return <CoursePlayerClient course={courseWithVideoUrls} />;
}