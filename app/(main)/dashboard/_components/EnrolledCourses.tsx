// In: app/dashboard/_components/EnrolledCourses.tsx
import CourseCard from "@/components/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { CourseCard as CourseCardType } from "@/utils/types";
import { BookOpen } from "lucide-react";

interface EnrolledCoursesProps {
    isLoading: boolean;
    courses: CourseCardType[] | undefined;
}

export function EnrolledCourses({ isLoading, courses }: EnrolledCoursesProps) {
    if (isLoading) {
        return <EnrolledCoursesSkeleton />;
    }

    if (!courses || courses.length === 0) {
        return (
            <div>
                <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">You're Not Enrolled in Any Courses Yet</h3>
                    <p className="text-muted-foreground mt-2">Start your learning journey by browsing our course catalog.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">My Courses ({courses.length})</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
}


function EnrolledCoursesSkeleton() {
    return (
        <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-[125px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}