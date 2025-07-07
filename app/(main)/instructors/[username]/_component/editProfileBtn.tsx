"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/use-session";

type EditProfileBtnProps = {
    username: string;
};

export default function EditProfileBtn({ username }: EditProfileBtnProps) {
    const router = useRouter();
    const { user } = useAuth();
    if (user?.username !== username)
        return null;
    return (
        <Button
            variant="outline"
            className="ml-2"
            onClick={() => router.push(`/instructors/${username}/edit`)}
        >
            Edit Profile
        </Button>
    );
}