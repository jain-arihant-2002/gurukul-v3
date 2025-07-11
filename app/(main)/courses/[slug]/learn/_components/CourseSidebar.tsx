import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CourseDetails, Lecture, Section } from "@/utils/types";
import { PlayCircle, FileText, HelpCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

interface CourseSidebarProps {
    course: CourseDetails;
    activeLectureId?: string;
    onLectureSelect: (lecture: Lecture) => void;
}

export function CourseSidebar({ course, activeLectureId, onLectureSelect }: CourseSidebarProps) {
    const getIcon = (type: Lecture["type"]) => {
        switch (type) {
            case "video": return PlayCircle;
            case "article": return FileText;
            case "quiz": return HelpCircle;
            default: return FileText;
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{course.title}</h2>
            <p className="text-sm text-muted-foreground mb-4">Course Content</p>
            <Link href={`/courses/${course.slug}`}>
                <Button variant="outline" className="w-full mb-4">Back to Course Page</Button>
            </Link>

            <Accordion type="multiple" defaultValue={(course.sections ?? []).map(s => s.id)} className="w-full">
                {(course.sections ?? []).map((section) => (
                    <AccordionItem key={section.id} value={section.id}>
                        <AccordionTrigger className="font-semibold">{section.title}</AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-1">
                                {(section.lectures ?? []).map((lecture) => {
                                    const Icon = getIcon(lecture.type);
                                    return (
                                        <li key={lecture.id}>
                                            <button
                                                onClick={() => onLectureSelect(lecture)}
                                                className={cn(
                                                    "w-full text-left flex items-center gap-3 p-2 rounded-md transition-colors text-sm",
                                                    activeLectureId === lecture.id
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "hover:bg-muted"
                                                )}
                                            >
                                                <Icon className="h-4 w-4 shrink-0" />
                                                <span className="flex-1">{lecture.title}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}