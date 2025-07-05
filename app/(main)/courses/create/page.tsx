"use client";

import { useState } from "react";
import { toast } from "sonner";
import CourseForm from "../_component/CourseForm";
import { CourseLevel, CourseStatus } from "@/utils/types";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/auth/use-session";

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
};

export default function AddCoursePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isInstructor, isAdmin, isPending } = useAuth();


  if (isPending)
    return;

  if (!isInstructor && !isAdmin) {
    useRouter().push("/not-found");
    setIsSubmitting(true);
  }
  const handleSubmit = async (data: any) => {


    try {
      const payload: CourseFormData = {
        ...data,
        level: data.level as CourseLevel,
        status: data.status as CourseStatus,
      };
      //Todo sanitize longDescriptionHtml

      // Console log all form data
      console.log("=== COURSE FORM SUBMISSION ===");
      console.log("Form Data:", payload);

      // Log individual fields for better debugging
      console.log("Course Details:", {
        title: payload.title,
        slug: payload.slug,
        shortDescription: payload.shortDescription,
        price: payload.price,
        language: payload.language,
        level: payload.level,
        status: payload.status
      });

      console.log("Course Content:", {
        longDescriptionHtml: payload.longDescriptionHtml,
        categories: payload.categories,
        whatWillYouLearn: payload.whatWillYouLearn,
        prerequisites: payload.prerequisites
      });

      console.log("Image Info:", {
        coverImageUrl: payload.coverImageUrl,
        base64Length: payload.coverImageUrl?.length || 0
      });

      // TODO: Implement course creation API call
      // TODO: Image upload will be handled with presigned URLs
      // The base64 string will be sent to the server and converted back to file
      // for uploading to cloud storage using presigned URLs

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success("Course created successfully!");

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