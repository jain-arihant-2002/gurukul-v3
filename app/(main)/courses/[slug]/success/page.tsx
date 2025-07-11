import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CoursePurchaseSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl font-bold text-center">
            Purchase Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-center text-lg">
            Thank you for your purchase. You now have full access to this course.
          </p>
          <Button asChild className="w-full mt-2">
            {/* Todo make this link to go to course with video page */}
            <Link href="../"> 
              Go to Course
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/courses/page/1">
              Browse More Courses
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}