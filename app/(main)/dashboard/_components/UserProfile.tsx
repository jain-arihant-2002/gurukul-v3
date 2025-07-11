// In: app/dashboard/_components/UserProfile.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Calendar } from "lucide-react";

interface UserProfileProps {
    isLoading: boolean;
    user: {
        name: string;
        email: string;
        image: string | null;
        createdAt: string;
    } | undefined | null;
}

export function UserProfile({ isLoading, user }: UserProfileProps) {
    if (isLoading) {
        return <UserProfileSkeleton />;
    }

    if (!user) {
        return (
            <Card>
                <CardHeader><CardTitle>My Profile</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Could not load user profile.</p>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user.image || undefined} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-semibold">{user.name}</h2>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                </div>
                <div className="space-y-2 pt-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Member since: {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function UserProfileSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <div className="space-y-2 pt-4">
                    <Skeleton className="h-4 w-full" />
                </div>
            </CardContent>
        </Card>
    );
}