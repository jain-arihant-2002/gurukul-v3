"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import CourseForm from "../_component/CourseForm";
import { CourseFormData, CourseLevel, CourseStatus } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/use-session";
import { createCourseAction } from "../_actions/action";

export default function AddCoursePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isInstructor, isAdmin, isPending } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.push("/sign-in");
      return
    }

    if (!isInstructor && !isAdmin) {
      router.push("/not-found");
      return
    }
  }, [isPending, isInstructor, isAdmin, router]);

  if (isPending || (!isInstructor && !isAdmin)) return null;

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const payload: CourseFormData = {
        ...data,
        level: data.level as CourseLevel,
        status: data.status as CourseStatus,
      };
      const result = await createCourseAction(payload)

      if (result.error) {
        toast.error(result.message);
        return
      }
      if (result.success && result.data?.status === 'published') {
        toast.success("Course created successfully!");
        router.push(`/courses/${result.data?.slug}`);
      } else {
        toast.success("Course created successfully!");
        router.push(`/courses/${result.data?.slug}/edit`);
      }
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CourseForm
      mode="create"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}