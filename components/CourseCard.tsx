import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { parseTags } from "@/utils/helperFunctions";
import { courses } from "@/DummyData";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

type CourseListProps = {
  limit?: number;
  courses?: typeof courses;
  showTitle?: boolean; // <-- Add this prop
};

export default function CourseList({ limit, courses: propCourses, showTitle = false }: CourseListProps) {
  const displayCourses = (propCourses ?? courses).slice(0, limit ?? (propCourses ?? courses).length);

  return (
    <section className="w-[80%] mx-auto my-12">
      {showTitle && (
        <h2 className="text-3xl font-bold mb-8 text-center text-foreground">
          Featured Courses
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCourses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader className="p-0">
              <div className="relative w-full h-40 rounded-t-md overflow-hidden">
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="object-cover w-full h-full"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {parseTags(course.category).map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                <span className="ml-auto text-xs text-muted-foreground">
                  Updated: {formatDate(course.updatedAt)}
                </span>
              </div>
              <CardTitle className="text-base font-semibold mt-2">{course.title}</CardTitle>
              <div className="mt-2 text-lg font-bold text-primary">${course.price}</div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/courses/${course.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}