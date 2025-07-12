import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import type { InstructorCard } from "@/utils/types";

// Single Instructor Card
export function InstructorCard({ instructor }: { instructor: InstructorCard }) {
  return (
    <Link href={`/instructors/${instructor.username}`} className="no-underline">
      <Card
        className="flex flex-col items-center text-center shadow-none border-muted bg-muted/40 hover:shadow-lg transition-shadow h-full min-h-[350px] max-h-[400px] w-full max-w-[320px] mx-auto"
      >
        <CardHeader className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-4 bg-muted flex items-center justify-center relative">
            <img
              src={instructor.avatarUrl ?? "/placeholder-avatar.png"}
              alt={instructor.name}
              width={64}
              height={64}
              className="object-cover w-16 h-16"
            />

          </div>
        </CardHeader>
        <CardTitle className="text-lg font-semibold">{instructor.name}</CardTitle>
        <div className="flex flex-wrap justify-center gap-1 mt-2 max-w-[220px] mx-auto">
          {(instructor.expertise).slice(0, 5).map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs truncate" title={tag}>
              {tag}
            </Badge>
          ))}
          {instructor.expertise.length > 5 && (
            <Badge variant="outline" className="text-xs">
              +{instructor.expertise.length - 5}
            </Badge>
          )}
        </div>
        <CardContent className="flex flex-col flex-1 justify-between w-full">
          <p className="text-muted-foreground text-sm mb-2">{instructor.bio}</p>
          <span className="text-xs text-primary font-medium">
            {instructor.coursesCount} Courses
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
