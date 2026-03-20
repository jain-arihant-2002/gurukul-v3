import { getCourseBySlug } from "@/lib/dal";
import LeftSection from "../_components/leftSection";
import RightSection from "../_components/rightSection";
import { getAuth } from "@/lib/auth/session";

export default async function CourseDetailPagePreview({ params }: { params: Promise<{ slug: string }> }) {
    const { user } = await getAuth();
    const { slug } = await params;
    const course = await getCourseBySlug(slug);

    if ((course?.authorId !== user?.id && user?.role !== 'admin') || !course) {
        return (
            <div className="w-[80%] min-h-[80vh] mx-auto my-12 text-center text-destructive text-xl">
                Course not found.
            </div>
        );
    }

    if (!course) {
        return (
            <div className="w-[80%] min-h-[80vh] mx-auto my-12 text-center text-destructive text-xl">
                Course not found.
            </div>
        );
    }


    return (
        <section className="w-[80%] mx-auto my-12">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left section: sticky on scroll */}
                <LeftSection course={course} isPreview={true} />


                {/* Right section - remains the same */}
                <RightSection course={course} />
            </div>
        </section >
    );
}