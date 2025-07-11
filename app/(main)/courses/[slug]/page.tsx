//Todo: rating logic or remove it 
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import VideoPlayerModalWrapper from "@/components/VideoPlayerModal";
import { getCourseBySlug } from "@/lib/dal";
import { Star, Users, Globe, Clock, CheckCircle, BookOpen, AlertCircle, Calendar } from "lucide-react";
import CourseStatusBadge from "./_components/CourseDetailBtn";
import CourseActionPanel from "./_components/CourseActionPanel";
import { getCloudinaryVideoUrl } from "@/utils/helperFunctions";
import { getAuth } from "@/lib/auth/session";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}


function renderStars(rating: number) {
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
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {

  const { user } = await getAuth()

  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if ((course?.authorId !== user?.id && course?.status === 'draft') || !course) {
    return (
      <div className="w-[80%] min-h-[80vh] mx-auto my-12 text-center text-destructive text-xl">
        Course not found.
      </div>
    );
  }

  const visibleSections = course.sections

  return (
    <section className="w-[80%] mx-auto my-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left section: sticky on scroll */}
        <div className="md:w-1/3 flex-shrink-0 md:sticky md:top-8 self-start">
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


          {/* Course Management - Now handled by client component */}
          <CourseStatusBadge course={course} />

        </div>


        {/* Right section - remains the same */}
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            {course.title}
          </h1>
          <p className="text-muted-foreground mb-4">
            {course.shortDescription}
          </p>

          {/* Author and Stats */}
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>
              By{" "}
              <span className="font-semibold text-primary">
                <Link href={`/instructors/${course.authorUsername}`} className="hover:underline">
                  {course.authorName}
                </Link>
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course.enrollmentCount.toLocaleString()} students
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              {course.language}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              { }
            </span>
          </div>

          {/* Rating Display */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              {/* {renderStars(course.rating)} */}
              <span className="text-sm text-muted-foreground">
                ({course.enrollmentCount.toLocaleString()} students)
              </span>
            </div>
          </div>

          {/* What will you learn */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              What you'll learn
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
              {course.whatWillYouLearn.map((item, idx) => (
                <li key={idx} className="text-foreground">{item}</li>
              ))}
            </ul>
          </div>

          {/* Prerequisites */}
          {course.prerequisites && course.prerequisites.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Prerequisites
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                {course.prerequisites.map((item, idx) => (
                  <li key={idx} className="text-foreground">{item}</li>
                ))}
              </ul>
            </div>
          )}

          <Separator className="my-8" />

          {/* Course Content */}
          <h2 className="text-xl font-semibold mb-4 mt-8">
            Course Content
          </h2>
          <div className="mb-4 text-sm text-muted-foreground">
            {(course?.sections?.length ?? 0)} sections • {(course?.sections?.reduce((acc, section) => acc + (section.lectures?.length ?? 0), 0) ?? 0)} lectures • {(course?.totalDurationHours ?? 0)} total length
          </div>

          <Accordion type="multiple" className="mb-8">
            {(visibleSections ?? []).map((section, idx) => (
              <AccordionItem
                key={idx}
                value={`section-${idx}`}
                className="border border-border rounded-lg mb-4 shadow-sm bg-muted/40"
              >
                <AccordionTrigger className="px-4 py-3 font-medium text-lg bg-muted/60 rounded-t-lg">
                  <div className="flex items-center justify-between w-full mr-4">
                    <span>{section.title}</span>
                    <span className="text-sm text-muted-foreground font-normal">
                      {(section.lectures?.length ?? 0)} lectures
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 border-t border-border bg-background rounded-b-lg">
                  <ul className="space-y-2">
                    {section.lectures?.map((video, vIdx) => (
                      <li
                        key={vIdx}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{video.title}</span>
                          <span className="text-xs text-muted-foreground">
                            ({course.totalDurationHours})
                          </span>
                          {video.isFreePreview && (
                            <Badge
                              variant="outline"
                              className="text-xs border-primary text-primary"
                            >
                              Preview
                            </Badge>
                          )}
                        </div>
                        {video.isFreePreview ? (
                          <VideoPlayerModalWrapper videoUrl={getCloudinaryVideoUrl(video.videoPublicId ?? '')} videoTitle={video.title} />
                        ) : (
                          <Button size="sm" variant="secondary" disabled>
                            Locked
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Separator className="my-8" />

          {/* Rich Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">About this course</h2>
            <div
              className="prose prose-neutral max-w-none dark:prose-invert break-words"
              dangerouslySetInnerHTML={{ __html: course.longDescriptionHtml }}
            />
          </div>
        </div>
      </div>
    </section >
  );
}