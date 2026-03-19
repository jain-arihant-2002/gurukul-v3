import { getAuth } from "@/lib/auth/session";
import { UserRole } from "@/utils/types";

export type AuthContext = {
    userId: string;
    isAdmin: boolean;
    isInstructor: boolean;
};

export type DalResponse<T = null> = {
    success: boolean;
    data: T | null;
    error: string | null;
};

export async function getAuthContext(): Promise<DalResponse<AuthContext>> {
    const { user, isAdmin, isInstructor } = await getAuth();

    if (!user) {
        return {
            success: false,
            data: null,
            error: "Unauthorized: You must be logged in",
        };
    }

    return {
        success: true,
        data: {
            userId: user.id,
            isAdmin,
            isInstructor,
        },
        error: null,
    };
}

export async function requireAuth(): Promise<AuthContext> {
    const result = await getAuthContext();

    if (!result.success) {
        throw new Error(result.error ?? "Unauthorized");
    }

    return result.data!;
}

export async function requireInstructor(): Promise<AuthContext> {
    const result = await getAuthContext();

    if (!result.success) {
        throw new Error(result.error ?? "Unauthorized");
    }

    if (!result.data!.isAdmin && !result.data!.isInstructor) {
        throw new Error("Forbidden: Instructor or admin role required");
    }

    return result.data!;
}

export async function requireAdmin(): Promise<AuthContext> {
    const result = await getAuthContext();

    if (!result.success) {
        throw new Error(result.error ?? "Unauthorized");
    }

    if (!result.data!.isAdmin) {
        throw new Error("Forbidden: Admin role required");
    }

    return result.data!;
}

export function isOwnerOrAdmin(ownerId: string, auth: AuthContext): boolean {
    return auth.isAdmin || auth.userId === ownerId;
}
