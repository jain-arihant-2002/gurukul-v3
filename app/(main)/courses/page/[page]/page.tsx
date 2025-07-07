import { redirect } from "next/navigation";
import CourseList from "@/app/(main)/_component/CourseList";
import PaginationBar from "@/components/PaginationBar";
import { getCoursesCard, getCoursesCount } from "@/lib/dal";
import AddCourseBtn from "@/app/(main)/courses/_component/AddCourseBtn"; // <-- Add this import

const COURSES_PER_PAGE = 12;

// This function generates static parameters for pagination
export async function generateStaticParams() {
    const totalCoursesCount = await getCoursesCount();
    const totalPages = Math.max(1, Math.ceil(totalCoursesCount / COURSES_PER_PAGE));
    return Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }));
}

export default async function AllCoursesPage({ params }: { params: Promise<{ page: string }> }) {
    const page = Number((await params).page);
    const totalCoursesCount = await getCoursesCount();
    const totalPages = Math.max(1, Math.ceil(totalCoursesCount / COURSES_PER_PAGE));

    if (!Number.isInteger(page) || page < 1 || page > totalPages) {
        redirect("/courses/page/1");
    }

    const offset = COURSES_PER_PAGE * (page - 1);
    const Course = await getCoursesCard({ limit: COURSES_PER_PAGE, offset }); // Fetching courses with pagination

    return (
        <section className="w-[80%] mx-auto my-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-foreground">
                    Explore All Courses
                </h1>
                <AddCourseBtn />
            </div>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                Browse our complete catalog of courses. Use the page bar below to explore
                more!
            </p>
            {
                Course.length > 0 ?
                    <CourseList Courses={Course} />
                    : <p>No Courses found </p>
            }
            <PaginationBar page={page} totalPages={totalPages} baseHref="/courses/page" />
        </section>
    );
}