"use client";

import { useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/utils/types";

export function useAuth() {
    const { data: session, isPending, error,refetch } = authClient.useSession();

    const user = session?.user ?? null;
    const isAuthenticated = !!user;

    // useMemo will prevent re-calculating these on every render unless the user changes.
    const permissions = useMemo(() => {
        const isAdmin = user?.role === UserRole.ADMIN;
        const isInstructor = user?.role === UserRole.INSTRUCTOR;
        return { isAdmin, isInstructor };
    }, [user]);

    return {
        session,
        user,
        isAuthenticated,
        isPending,
        error,
        refetch,
        ...permissions,
    };
}