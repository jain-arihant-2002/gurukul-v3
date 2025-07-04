import InstructorsList from '@/app/(main)/_component/InstructorList';
import PaginationBar from "@/components/PaginationBar";
import { getInstructorCard } from '@/lib/dal';
import { getTotalInstructorsCountFromDb } from '@/lib/data/query';
import { redirect } from 'next/navigation';

const INSTRUCTORS_PER_PAGE = 16;

// Add generateStaticParams for static generation of instructor pages
export async function generateStaticParams() {
    const totalInstructors = await getTotalInstructorsCountFromDb();
    const totalPages = Math.max(1, Math.ceil(totalInstructors / INSTRUCTORS_PER_PAGE));
    return Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }));
}


export default async function AllInstructorsPage({ params }: { params: Promise<{ page: string }> }) {
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
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
                    Explore All Instructors
                </h1>
                <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                    Browse our complete list of instructors and find your next mentor!
                </p>
                {totalInstructors ? <InstructorsList Instructors={Instructor} /> : <p >No instructor found</p>}
                <PaginationBar page={page} totalPages={totalPages} baseHref="/instructors/page" />
            </div>
        </section>
    );
}