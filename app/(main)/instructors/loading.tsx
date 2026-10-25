import InstructorListSkeleton from "@/components/InstructorListSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder only — see app/(main)/loading.tsx for why there are no headings here. */
export default function Loading() {
  return (
    <section className="py-16 bg-background" aria-hidden="true" aria-busy="true">
      <div className="w-[80%] mx-auto px-4">
        <Skeleton className="h-9 w-64 mx-auto mb-4 rounded-md" />
        <Skeleton className="h-5 w-full max-w-2xl mx-auto mb-12 rounded-md" />
        <InstructorListSkeleton count={16} />
      </div>
    </section>
  );
}
