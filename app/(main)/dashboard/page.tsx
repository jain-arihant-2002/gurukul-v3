// In: app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/use-session";
import { Loader2 } from "lucide-react";

import { getDashboardData } from "./_actions/actions";
import { UserProfile } from "./_components/UserProfile";
import { EnrolledCourses } from "./_components/EnrolledCourses";
import { CourseCard } from "@/utils/types";
import { toast } from "sonner";

interface DashboardData {
    user: {
        name: string;
        email: string;
        image: string | null;
        createdAt: string;
    };
    enrolledCourses: CourseCard[];
}

export default function DashboardPage() {
    const { isAuthenticated, isPending } = useAuth();
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Effect for handling authentication
    useEffect(() => {
        if (!isPending && !isAuthenticated) {
            return router.replace("/sign-in");
        }
    }, [isAuthenticated, isPending]);

    // Effect for fetching dashboard data
    useEffect(() => {
        if (isAuthenticated) {
            getDashboardData()
                .then(result => {
                    if (result.success && result.data) {
                        setDashboardData(result.data);
                    } else {
                        toast.error("Failed to load dashboard data.");
                        console.error(result.message);
                    }
                })
                .finally(() => {
                    setIsLoadingData(false);
                });
        }
    }, [isAuthenticated]);

    // --- Render States ---

    if (isPending || !isAuthenticated) {
        // Show a full-page loader while checking auth or redirecting
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-7xl px-4 py-12">
            <h1 className="mb-8 text-3xl font-bold text-foreground">My Dashboard</h1>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
                {/* Left Column: User Profile */}
                <aside className="lg:col-span-1">
                    <UserProfile
                        isLoading={isLoadingData}
                        user={dashboardData?.user}
                    />
                </aside>

                {/* Right Column: Enrolled Courses */}
                <main className="lg:col-span-2">
                    <EnrolledCourses
                        isLoading={isLoadingData}
                        courses={dashboardData?.enrolledCourses}
                    />
                </main>
            </div>
        </div>
    );
}