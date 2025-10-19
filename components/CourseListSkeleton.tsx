import { Skeleton } from "@/components/ui/skeleton";

export default function CourseListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          {/* Mimics the CourseCard structure */}
          <Skeleton className="h-40 w-full rounded-md" />
          <div className="space-y-2 p-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}