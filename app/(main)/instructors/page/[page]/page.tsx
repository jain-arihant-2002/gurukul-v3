import type { Metadata } from "next";
import Link from "next/link";
import InstructorsList from '@/app/(main)/_component/InstructorList';
import PaginationBar from "@/components/PaginationBar";
import { getInstructorCard } from '@/lib/dal';
import { getTotalInstructorsCountFromDb } from '@/lib/data/queries';
import { redirect } from 'next/navigation';
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, itemListJsonLd, socialMetadata } from "@/lib/seo";

const INSTRUCTORS_PER_PAGE = 16;
const INSTRUCTORS_TITLE = "Gurukul Instructors — Meet Our Expert Teachers";

type InstructorsPageProps = { params: Promise<{ page: string }> };

// Add generateStaticParams for static generation of instructor pages
export async function generateStaticParams() {
    const totalInstructors = await getTotalInstructorsCountFromDb();
    const totalPages = Math.max(1, Math.ceil(totalInstructors / INSTRUCTORS_PER_PAGE));
    return Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }));
}

export async function generateMetadata({ params }: InstructorsPageProps): Promise<Metadata> {
    const page = Number((await params).page) || 1;
    const totalInstructors = await getTotalInstructorsCountFromDb();
    const totalPages = Math.max(1, Math.ceil(totalInstructors / INSTRUCTORS_PER_PAGE));

    // Out-of-range pages redirect in the component below; never let them claim
    // a page number or canonical of their own.
    if (!Number.isInteger(page) || page < 1 || page > totalPages) {
        return { title: { absolute: INSTRUCTORS_TITLE }, robots: { index: false, follow: true } };
    }

    const title = page === 1 ? INSTRUCTORS_TITLE : `${INSTRUCTORS_TITLE} — Page ${page}`;
    const description = page === 1
        ? "Meet the Gurukul instructors. Each profile lists the instructor's expertise and the Gurukul courses they teach, so you can pick the right teacher."
        : `Page ${page} of Gurukul instructors. Browse more Gurukul instructor profiles, see their expertise, and find the courses they teach.`;

    return {
        title: { absolute: title },
        description,
        alternates: { canonical: `/instructors/page/${page}` },
        ...socialMetadata({ title, description, path: `/instructors/page/${page}` }),
    };
}

export default async function AllInstructorsPage({ params }: InstructorsPageProps) {
    const page = Number((await params).page);
    const totalInstructors = await getTotalInstructorsCountFromDb()
    const totalPages = Math.max(1, Math.ceil(totalInstructors / INSTRUCTORS_PER_PAGE));

    if (!Number.isInteger(page) || page < 1 || page > totalPages) {
        redirect("/instructors/page/1");
    }

    const offset = INSTRUCTORS_PER_PAGE * (page - 1);
    const Instructor = await getInstructorCard({ limit: INSTRUCTORS_PER_PAGE, offset });

    return (
        <section className="py-16 bg-background">
            <div className="w-[80%] mx-auto px-4">
                <JsonLd
                    data={[
                        breadcrumbJsonLd([
                            { name: "Home", path: "/" },
                            { name: "Gurukul Instructors", path: `/instructors/page/${page}` },
                        ]),
                        itemListJsonLd(
                            "Gurukul Instructors",
                            Instructor.map((instructor) => ({
                                name: instructor.name,
                                path: `/instructors/${instructor.username}`,
                            })),
                            "Person"
                        ),
                    ]}
                />
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
                    Gurukul Instructors
                </h1>
                <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                    Browse Gurukul instructor profiles and find your next mentor. Page {page} of{" "}
                    {totalPages} — each profile shows the instructor&apos;s expertise and the
                    Gurukul courses they teach. You can also{" "}
                    <Link href="/courses/page/1" className="text-primary font-medium hover:underline">
                        browse all Gurukul courses
                    </Link>
                    .
                </p>
                {Instructor.length > 0 ? <InstructorsList Instructors={Instructor} /> : (
                    <p className="text-center text-muted-foreground">
                        No Gurukul instructors are listed yet. Instructors appear here once they
                        publish their first course.
                    </p>
                )}
                <PaginationBar page={page} totalPages={totalPages} baseHref="/instructors/page" />
            </div>
        </section>
    );
}
