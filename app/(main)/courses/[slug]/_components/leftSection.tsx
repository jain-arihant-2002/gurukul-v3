//Todo: rating logic or remove it 
import { Users, Globe, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseDetails } from "@/utils/types";
import CourseActionPanel from "./CourseActionPanel";
import CourseStatusBadge from "./CourseDetailBtn";

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}


export default function LeftSection({ course, isPreview = false }: { course: CourseDetails, isPreview?: boolean }) {

    return <div className="md:w-1/3 flex-shrink-0 md:sticky md:top-8 self-start">
        <img
            src={course?.coverImage || "/placeholder-image.png"}
            alt={course.title}
            className="w-full h-56 object-cover rounded-lg shadow"
        />

        {/* Course Stats */}
        <Card className="mt-4">
            <CardContent className="p-4">
                <div className="space-y-3">
                    {/* Rating */}
                    {/* <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rating</span>
                  <div className="flex items-center gap-2">
                    {renderStars(course.rating)}
                  </div>
                </div> */}

                    {/* Enrollment Count */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Students</span>
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{course.enrollmentCount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Language */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Language</span>
                        <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{course.language}</span>
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Duration</span>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{course.totalDurationHours}</span>
                        </div>
                    </div>

                    {/* Level */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Level</span>
                        <Badge variant="secondary" className="text-xs">
                            {course.level}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Categories */}
        <div className="mt-4 flex flex-wrap gap-2">
            {course.categories.map((cat) => (
                <Badge key={cat} variant="secondary" className="text-xs">
                    {cat}
                </Badge>
            ))}
        </div>

        {/* Dates - Now handled by client component */}
        <Card className="mt-4">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm">Course Dates</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Created</span>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span>{formatDate(course.createdAt)}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Updated</span>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span>{formatDate(course.updatedAt)}</span>
                        </div>
                    </div>
                </div>
                {/* Purchase Button */}
                <div className="mt-6 flex flex-col gap-2">
                    <CourseActionPanel courseId={course.id} courseSlug={course.slug} price={course.price} />
                </div>
            </CardContent>
        </Card>


        {/* MOVE THIS TO PREVIEW Course Management - Now handled by client component */}
        {isPreview && <CourseStatusBadge course={course} />}

    </div>
}