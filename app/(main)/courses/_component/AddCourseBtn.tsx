"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/lib/auth/use-session";


export default function AddCourseBtn() {
  const router = useRouter();
  const { isPending, isInstructor, isAdmin } = useAuth();

  if (isPending || (!isInstructor && !isAdmin)) {
    return null;
  }

  return (
    <Button
      variant="default"
      onClick={() => router.push("/courses/create")}
      className="flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      Add Course
    </Button>
  );
}