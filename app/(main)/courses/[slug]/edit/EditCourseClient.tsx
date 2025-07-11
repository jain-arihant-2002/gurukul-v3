"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CourseForm from "../../_components/CourseForm";
import { CourseFormData, CourseLevel, CourseStatus } from "@/utils/types";
import { updateCourseAction } from "../../_actions/action";
import { useAuth } from "@/lib/auth/use-session";


export default function EditCourseClient({ initialData }: { initialData: CourseFormData }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.id !== initialData.authorId) {
            toast.error("You do not have permission to edit this course.");
            router.push(`/courses/${initialData.slug}`);
        }
    }, [user, initialData.authorId, initialData.slug, router]);

    if (user && user.id !== initialData.authorId) {
        return null;
    }

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const payload: CourseFormData = {
                ...data,
                id: initialData.id,
                level: data.level as CourseLevel,
                status: data.status as CourseStatus,
            };
            const result = await updateCourseAction(payload);

            if (result.error) {
                toast.error(result.message);
                return;
            }
            router.refresh();
            toast.success("Course updated successfully!");
            if (result.data?.status === 'published')
                router.push(`/courses/${result.data?.slug}`);

            router.push(`/courses/page/1`);
        } catch (error) {
            toast.error("Failed to update course. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <CourseForm
            mode="edit"
            initialData={initialData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        />
    );
}
