'use client';
//Todo extract logic  authClient.useSession in a hook and buttons href
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Edit, Settings, BarChart, Users } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface CourseAdminActionsProps {
  course: {
    status: string;
    authorId: string;
    slug: string;
    title: string;
    enrollmentCount: number;
  };
}

export default function CourseAdminActions({ course }: CourseAdminActionsProps) {
  const { data: session } = authClient.useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null;
  }

  const isAdmin = session?.user?.role === 'admin';
  const isOwner = session?.user?.role === 'instructor' && session?.user?.id === course.authorId;
  
  // Only show admin actions if user has appropriate role
  if (!isAdmin && !isOwner) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Course Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Display */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          <Badge
            variant={course.status === 'published' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {course.status === 'published' ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <AlertCircle className="w-3 h-3 mr-1" />
            )}
            {course.status}
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Enrolled</span>
            <span className="font-medium">{course.enrollmentCount}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Primary Edit Button */}
          <Button asChild size="sm" className="w-full">
            <Link href={`/courses/${course.slug}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Course
            </Link>
          </Button>

          {/* Secondary Actions */}
          {/* <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/courses/${course.slug}/analytics`}>
                <BarChart className="w-4 h-4 mr-1" />
                Analytics
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="sm">
              <Link href={`/courses/${course.slug}/students`}>
                <Users className="w-4 h-4 mr-1" />
                Students
              </Link>
            </Button>
          </div> */}

          {/* Settings Link */}
          {/* <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href={`/courses/${course.slug}/settings`}>
              <Settings className="w-4 h-4 mr-2" />
              Course Settings
            </Link>
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}