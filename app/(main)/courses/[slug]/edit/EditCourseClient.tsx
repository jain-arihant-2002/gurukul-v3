"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CourseForm from "../../_component/CourseForm";
import { CourseLevel, CourseStatus } from "@/utils/types";

type CourseFormData = {
    title: string;
    slug: string;
    shortDescription: string;
    longDescriptionHtml: string;
    price: string;
    language: string;
    level: CourseLevel;
    status: CourseStatus;
    categories: string[];
    whatWillYouLearn: string[];
    prerequisites?: string[];
    coverImageUrl?: string;
    updatedAt: string;
};

export default function EditCourseClient({ initialData }: { initialData: CourseFormData }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            // Convert level and status to correct enum types
            const formattedData: CourseFormData = {
                ...data,
                level: data.level as CourseLevel,
                status: data.status as CourseStatus,
                updatedAt: new Date().toISOString(), // Add updatedAt field
            };
            // TODO: Implement course update API call here
            console.log("=== COURSE FORM SUBMISSION ===");
            console.log("Form Data:", formattedData);
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Course updated successfully!");
            router.push(`/courses/${formattedData.slug}`);
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
