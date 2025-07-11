import { XCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CoursePaymentCancelledPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <CardTitle className="text-2xl font-bold text-center">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-center text-lg">
            Your payment was cancelled. You can try again or browse more courses.
          </p>
          <Button asChild className="w-full mt-2">
            <Link href="/courses/page/1">
              Browse Courses
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">
              Go to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
