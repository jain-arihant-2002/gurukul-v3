import CourseListSkeleton from "@/components/CourseListSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder only — see app/(main)/loading.tsx for why there are no headings here. */
export default function Loading() {
  return (
    <section className="w-[80%] mx-auto my-12" aria-hidden="true" aria-busy="true">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-9 w-56 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
      <Skeleton className="h-5 w-full max-w-2xl mx-auto mb-8 rounded-md" />
      <CourseListSkeleton count={12} />
    </section>
  );
}
