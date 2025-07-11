import { XCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function CoursePaymentFailedPage({ params }: { params: Promise<{ slug: string }> }) {

  const { slug } = await params;
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <CardTitle className="text-2xl font-bold text-center">
            Payment Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-center text-lg">
            Your payment could not be processed. Please try again or contact support if the issue persists.
          </p>
          <Button asChild className="w-full mt-2">
            <Link href={`/courses/${slug}`}>
              Back to Course
            </Link>
          </Button>
            <Link href="/courses/page/1">
          <Button asChild variant="outline" className="w-full">
              Browse More Courses
          </Button>
            </Link>
        </CardContent>
      </Card>
    </div>
  );
}