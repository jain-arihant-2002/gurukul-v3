import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { CourseCard } from "@/utils/types";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function CourseCard({ course }: { course: CourseCard; }) {

  return (<Card key={course.id} className="flex flex-col">
    <CardHeader className="p-0">
      <div className="relative w-full h-40 rounded-t-md overflow-hidden">
        <img
          src={course.coverImageUrl || "/placeholder-image.png"} //Todo :add placeholder image . here Fallback image if coverImageUrl is null retrived from the public folder  
          alt={course.title}
          className="object-cover w-full h-full"
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
        <span
          className="absolute top-2 right-2 bg-accent text-foreground text-xs font-semibold px-3 py-1 rounded shadow"
          style={{ pointerEvents: "none" }}
        >
          {course.level}
        </span>
      </div>
    </CardHeader>
    <CardContent className="flex-1 flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2 mt-2">
        {(course.categories).map((tag, idx) => (
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
        <Link href={`/courses/${course.slug}`}>View Details</Link>
      </Button>
    </CardFooter>
  </Card>)
}
// Todo add rating, on hover section description , order videos in sections and order sections in course