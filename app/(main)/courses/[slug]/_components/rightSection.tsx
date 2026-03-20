//Todo: rating logic or remove it 
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import VideoPlayerModalWrapper from "@/components/VideoPlayerModal";
import { Users, Globe, Clock, BookOpen, AlertCircle } from "lucide-react";
import { getCloudinaryVideoUrl } from "@/utils/helperFunctions";
import { CourseDetails } from "@/utils/types";


export default function RightSection({ course }: { course: CourseDetails }) {

    const visibleSections = course.sections

    return <div className="md:w-2/3">
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
                {course.totalDurationHours} hours
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
}