import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import CourseList from "@/app/(main)/_component/CourseList";
import PaginationBar from "@/components/PaginationBar";
import { getCoursesCard, getCoursesCount } from "@/lib/dal";
import AddCourseBtn from "@/app/(main)/courses/_components/AddCourseBtn";
import { JsonLd } from "@/components/JsonLd";
import { COURSES_TITLE, breadcrumbJsonLd, itemListJsonLd, socialMetadata } from "@/lib/seo";

const COURSES_PER_PAGE = 12;

type CoursesPageProps = { params: Promise<{ page: string }> };

// This function generates static parameters for pagination
export async function generateStaticParams() {
    const totalCoursesCount = await getCoursesCount();
    const totalPages = Math.max(1, Math.ceil(totalCoursesCount / COURSES_PER_PAGE));
    return Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }));
}

export async function generateMetadata({ params }: CoursesPageProps): Promise<Metadata> {
    const page = Number((await params).page) || 1;
    const totalCoursesCount = await getCoursesCount();
    const totalPages = Math.max(1, Math.ceil(totalCoursesCount / COURSES_PER_PAGE));

    // Out-of-range pages redirect in the component below; never let them claim
    // a page number or canonical of their own.
    if (!Number.isInteger(page) || page < 1 || page > totalPages) {
        return { title: { absolute: COURSES_TITLE }, robots: { index: false, follow: true } };
    }

    const title = page === 1 ? COURSES_TITLE : `${COURSES_TITLE} — Page ${page}`;
    const description = page === 1
        ? "Browse every course on Gurukul. Filter by category, level, and price to find the Gurukul course that fits your goals, then learn at your own pace."
        : `Page ${page} of the Gurukul course catalog. Browse more Gurukul courses by category, level, and price, taught by expert Gurukul instructors.`;

    return {
        title: { absolute: title },
        description,
        alternates: { canonical: `/courses/page/${page}` },
        ...socialMetadata({ title, description, path: `/courses/page/${page}` }),
    };
}

export default async function AllCoursesPage({ params }: CoursesPageProps) {
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
            <JsonLd
                data={[
                    breadcrumbJsonLd([
                        { name: "Home", path: "/" },
                        { name: "Gurukul Courses", path: `/courses/page/${page}` },
                    ]),
                    itemListJsonLd(
                        "Gurukul Courses",
                        Course.map((course) => ({ name: course.title, path: `/courses/${course.slug}` })),
                        "Course"
                    ),
                ]}
            />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-foreground">
                    Gurukul Courses
                </h1>
                <AddCourseBtn />
            </div>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                Browse the complete Gurukul course catalog. Page {page} of {totalPages} — every
                course is taught by a verified Gurukul instructor, and you can learn at your own
                pace on any device. Looking for the people behind the lessons?
                {" "}
                <Link href="/instructors/page/1" className="text-primary font-medium hover:underline">
                    Meet the Gurukul instructors
                </Link>
                .
            </p>
            {
                Course.length > 0 ?
                    <CourseList Courses={Course} />
                    : <p className="text-center text-muted-foreground">
                        No Gurukul courses have been published yet. Check back soon — new courses
                        are added by our instructors every week.
                    </p>
            }
            <PaginationBar page={page} totalPages={totalPages} baseHref="/courses/page" />
        </section>
    );
}
