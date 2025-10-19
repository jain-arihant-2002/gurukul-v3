import { Skeleton } from "@/components/ui/skeleton";
import CourseListSkeleton from "@/components/CourseListSkeleton";

export default function InstructorLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left: Profile Card Skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* Main Profile Card */}
              <div className="border bg-card rounded-xl p-6 space-y-6">
                {/* Avatar and Name */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <Skeleton className="w-32 h-32 rounded-full" />
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-6 w-56" />
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="w-10 h-10 rounded-full" />
                </div>

                <Skeleton className="h-px w-full" />

                {/* Statistics */}
                <div className="space-y-4">
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </div>

                <Skeleton className="h-px w-full" />

                {/* Join Date */}
                <div className="flex flex-col items-center space-y-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content Sections Skeleton */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <div className="space-y-2 pl-7">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[85%]" />
              </div>
            </div>

            {/* Expertise Section */}
            <div className="space-y-6">
              <Skeleton className="h-8 w-48" />
              <div className="flex flex-wrap gap-2 pl-7">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>

            {/* Courses Section */}
            <div className="space-y-6">
              <Skeleton className="h-8 w-80" />
              <div className="pl-7">
                {/* Reuse the CourseListSkeleton */}
                <CourseListSkeleton count={2} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}