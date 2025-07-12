import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import type { CourseCard, CourseStatus } from "@/utils/types";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}



export default function CourseCard({ course }: { course: CourseCard; }) {
  const getStatusBadgeVariant = (status?: CourseStatus) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'archived':
        return 'destructive';
      case 'draft':
      default:
        return 'secondary';
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-gray-300" />
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0"
              style={{ clipPath: 'inset(0 50% 0 0)' }} />
          </div>
        )}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="text-sm text-muted-foreground ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  return (
    <Card className="flex flex-col group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative w-full h-40 rounded-t-md overflow-hidden">
          <img
            src={course.coverImage || "/placeholder-image.png"}
            alt={course.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />

          {/* Level Badge */}
          {course.status && course.status !== 'published' && (
            <Badge
              variant={getStatusBadgeVariant(course.status)}
              className="bg-background/90 backdrop-blur-sm text-xs font-semibold capitalize"
            >
              {course.status}
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold"
          >
            {course.level}
          </Badge>

          {/* Hover Overlay with Description */}
          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
            <div className="text-white text-center">
              <h3 className="font-semibold mb-2 text-sm">{course.title}</h3>
              <p className="text-xs text-gray-200 line-clamp-4 leading-relaxed">
                {/* Show short description or truncated content */}
                {course.shortDescription ||
                  "Discover comprehensive lessons designed to help you master new skills and advance your career. Join thousands of students already learning with this course."}
              </p>
              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-300">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{course.enrollmentCount || 0} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>{course.level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 p-4">
        {/* Categories and Updated Date */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1">
            {(course.categories).slice(0, 2).map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {course.categories.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{course.categories.length - 2}
              </Badge>
            )}
          </div>
          <span className="ml-auto text-xs text-muted-foreground">
            {formatDate(course.updatedAt)}
          </span>
        </div>

        {/* Course Title */}
        <CardTitle className="text-base font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </CardTitle>

        {/* Author */}
        {course.authorName && (
          <p className="text-sm text-muted-foreground">
            by {course.authorName}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center justify-between">
        {/*   {renderStars(course.rating)}*/}
          <span className="text-sm text-muted-foreground">
            {course.enrollmentCount || 0} students
          </span>
        </div> 

        {/* Price */}
        <div className="mt-auto">
          <div className="text-2xl font-bold text-primary">
            {course.price === 0 ? (
              <span>Free</span>
            ) : (
              `$${course.price}`
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
          <Link href={`/courses/${course.slug}`}>
            View Course
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}