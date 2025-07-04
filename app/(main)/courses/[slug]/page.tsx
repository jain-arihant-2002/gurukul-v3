import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import VideoPlayerModalWrapper from "@/components/VideoPlayerModal";
import { getCourseBySlug } from "@/lib/dal";


export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    return (
      <div className="w-[80%] min-h-[80vh] mx-auto my-12 text-center text-destructive text-xl">
        Course not found.
      </div>
    );
  }

  // Show max 5 sections unless "Show More" is clicked (handled client-side if needed)
  // For server component, always show all sections or just the first 5 for simplicity
  const visibleSections = course.sections.slice(0, 5);

  return (
    <section className="w-[80%] mx-auto my-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left section: sticky on scroll */}
        <div className="md:w-1/3 flex-shrink-0 md:sticky md:top-8 self-start">
          <img
            src={course?.coverImageUrl || "/placeholder-course-cover.jpg"}
            alt={course.title}
            className="w-full h-56 object-cover rounded-lg shadow"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {course.categories.map((cat) => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {cat}
              </Badge>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Button className="w-full text-lg font-semibold">
              Buy Course &nbsp;{" "}
              <span className="font-bold">${course.price}</span>
            </Button>
          </div>
        </div>
        {/* Right section */}
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            {course.title}
          </h1>
          <p className="text-muted-foreground mb-2">
            {course.shortDescription}
          </p>
          <div className="mb-4 text-sm text-muted-foreground">
            <span className="mr-4">
              By{" "}
              <span className="font-semibold text-primary">
                <Link href={`/instructors/${course.authorUsername}`} className="hover:underline">
                  {course.authorName}
                </Link>
              </span>
            </span>
            <span className="mr-4">
              Total Time:{" "}
              <span className="font-semibold">{course.totalDurationSeconds}</span>
            </span>
            <span>
              Price:{" "}
              <span className="font-semibold text-primary">
                ${course.price}
              </span>
            </span>
          </div>

          {/* What will you learn */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">What you'll learn</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
              {course.whatWillYouLearn.map((item, idx) => (
                <li key={idx} className="text-foreground">{item}</li>
              ))}
            </ul>
          </div>

          {/* Course Content */}
          <h2 className="text-xl font-semibold mb-4 mt-8">
            Course Content
          </h2>
          <Accordion type="multiple" className="mb-8">
            {visibleSections.map((section, idx) => (
              <AccordionItem
                key={idx}
                value={`section-${idx}`}
                className="border border-border rounded-lg mb-4 shadow-sm bg-muted/40"
              >
                <AccordionTrigger className="px-4 py-3 font-medium text-lg bg-muted/60 rounded-t-lg">
                  <span>{section.title}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 border-t border-border bg-background rounded-b-lg">
                  <ul className="space-y-2">
                    {section.lectures.map((video, vIdx) => (
                      <li
                        key={vIdx}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{video.title}</span>
                          <span className="text-xs text-muted-foreground">
                            ({video.durationInSeconds})
                          </span>
                          {video.isFreePreview && (
                            <Badge
                              variant="outline"
                              className="text-xs border-primary text-primary"
                            >
                              Public
                            </Badge>
                          )}
                        </div>
                        {video.isFreePreview ? (
                          <VideoPlayerModalWrapper videoUrl={video.videoUrl ?? ''} videoTitle={video.title} />
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
          {/* Show More/Less button and modal would require a client component */}
          {/* Rich Description */}
          <div
            className="prose prose-neutral max-w-none mb-6 dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: course.longDescriptionHtml }}
          />
        </div>
      </div>
    </section>
  );
}

// todo add rating enrollment count , language, prerequisites ,updated at, created at , status for instructors only 