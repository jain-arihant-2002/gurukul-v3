import CourseListSkeleton from "@/components/CourseListSkeleton";
import InstructorListSkeleton from "@/components/InstructorListSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Route-level skeleton for the (main) group.
 *
 * Skeletons are placeholders, not content: no <h1>/<h2> and no marketing copy,
 * because this markup is streamed into the initial HTML. Duplicating the real
 * page's headings here gave crawlers a second H1 and stale, pre-edit copy.
 * Marked aria-hidden so assistive tech skips the placeholder entirely.
 */
export default function Loading() {
  return (
    <div aria-hidden="true" aria-busy="true">
      {/* Hero placeholder */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-16">
        <div className="w-full max-w-2xl space-y-6">
          <Skeleton className="h-12 w-4/5 mx-auto rounded-lg" />
          <Skeleton className="h-6 w-full mx-auto" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Skeleton className="h-11 w-36 rounded-md" />
            <Skeleton className="h-11 w-36 rounded-md" />
          </div>
        </div>
      </section>

      {/* Featured courses placeholder */}
      <section className="w-[80%] mx-auto my-12">
        <Skeleton className="h-9 w-72 mx-auto mb-8 rounded-md" />
        <CourseListSkeleton count={3} />
      </section>

      {/* Top instructors placeholder */}
      <section className="py-16 bg-background">
        <div className="w-[80%] mx-auto px-4">
          <Skeleton className="h-9 w-64 mx-auto mb-4 rounded-md" />
          <Skeleton className="h-5 w-full max-w-2xl mx-auto mb-12 rounded-md" />
          <InstructorListSkeleton count={4} />
        </div>
      </section>
    </div>
  );
}
