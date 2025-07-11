"use client";

import { useState, useEffect } from "react";
import type { CourseDetails, Lecture } from "@/utils/types";
import { CourseSidebar } from "./CourseSidebar";
import { VideoDisplay } from "./VideoDisplay";

interface CoursePlayerClientProps {
    course: CourseDetails;
}

export function CoursePlayerClient({ course }: CoursePlayerClientProps) {
    // Find the very first lecture in the course to be the default
    const findFirstLecture = (): Lecture | null => {
        const lecture = course.sections?.[0]?.lectures?.[0];
        if (!lecture) return null;
        // Ensure all required Lecture properties are present
        if (lecture.order === undefined || lecture.type === undefined) return null;
        return lecture as Lecture;
    };

    const [activeLecture, setActiveLecture] = useState<Lecture | null>(findFirstLecture());

    // This effect ensures that if the course data changes, we reset the active lecture.
    useEffect(() => {
        setActiveLecture(findFirstLecture());
    }, [course]);

    return (
        <div className="flex h-[calc(100vh-4.6rem)]">
            {/* Sidebar for navigation */}
            <aside className="w-80 border-r overflow-y-auto">
                <CourseSidebar
                    course={course}
                    activeLectureId={activeLecture?.id}
                    onLectureSelect={setActiveLecture}
                />
            </aside>

            {/* Main content area for video display */}
            <main className="flex-1">
                <VideoDisplay lecture={activeLecture} />
            </main>
        </div>
    );
}