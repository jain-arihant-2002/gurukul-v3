'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PurchaseButton from "./PurchaseButton";
import { useAuth } from "@/lib/auth/use-session";

interface CourseActionPanelProps {
    courseId: string;
    courseSlug: string;
    price: number;
}

export default function CourseActionPanel({ courseId, courseSlug, price }: CourseActionPanelProps) {
    const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
    const { user, isPending } = useAuth();

    useEffect(() => {
        if (isPending || !user) {
            if (!isPending && !user) setIsEnrolled(false);
            return;
        }

        setIsEnrolled(null);

        const checkEnrollmentStatus = async () => {
            try {
                const response = await fetch(`/api/courses/enrollment-status?courseId=${courseId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch enrollment status");
                }
                const data = await response.json();
                setIsEnrolled(data.isEnrolled);
            } catch (error) {
                console.error(error);
                setIsEnrolled(false);
            }
        };

        checkEnrollmentStatus();
    }, [courseId, user, isPending]);

      if (isEnrolled === null) {
        return <Skeleton className="h-12 w-full" />;
      }

    if (isEnrolled) {
        return (
            <Button asChild className="w-full text-lg font-semibold">
                <Link href={`/courses/${courseSlug}/learn`}>Go to Course</Link>
            </Button>
        );
    }

    return <PurchaseButton courseId={courseId} price={price} />;
}