"use client";

import React, { useState } from "react";
import InstructorForm from "../../register/_component/instructorForm";
import type { Instructor } from "@/utils/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateInstructorProfileAction } from "../../_action/action";

export default function EditTeacherProfilePage({ initialData }: { initialData: Partial<Instructor> }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any): Promise<void> => {
    setIsSubmitting(true);
    try {
      const result = await updateInstructorProfileAction({ ...data, id: initialData.id });
      if (result?.error) {
        toast.error(result.message || "Failed to update instructor profile.");
        return;
      } else {
        router.refresh();
        toast.success("Instructor profile updated successfully!");
        // Redirect to the instructor's profile page
        router.push(`/instructors`);
        return;
      }
    } catch (error) {
      toast.error("Failed to update instructor profile. Please try again.");
      console.error("Failed to update instructor profile:", error);
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <InstructorForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}