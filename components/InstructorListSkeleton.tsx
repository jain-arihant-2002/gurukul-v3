import { Skeleton } from "@/components/ui/skeleton";

export default function InstructorListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center text-center space-y-3 border bg-card p-4 rounded-xl">
          {/* Mimics the InstructorCard structure */}
          <Skeleton className="w-16 h-16 rounded-full" />
          <Skeleton className="h-6 w-3/4" />
          
          {/* Expertise Badges */}
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-5 w-14 rounded-md" />
          </div>

          {/* Bio Snippet */}
          <div className="space-y-2 pt-2 flex-1 w-full">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Courses Count */}
          <Skeleton className="h-4 w-1/3 mt-auto" />
        </div>
      ))}
    </div>
  );
}