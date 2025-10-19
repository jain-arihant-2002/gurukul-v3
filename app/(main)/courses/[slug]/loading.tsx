import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CourseDetailLoading() {
  return (
    <section className="w-[80%] mx-auto my-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* --- Left Column Skeleton --- */}
        <div className="md:w-1/3 flex-shrink-0 md:sticky md:top-8 self-start space-y-4">
          {/* Image Skeleton */}
          <Skeleton className="w-full h-56 rounded-lg" />

          {/* Course Stats Card Skeleton */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-28" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
              </div>
            </CardContent>
          </Card>

          {/* Categories Skeleton */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
          
          {/* Action Panel Skeleton */}
          <Card>
            <CardContent className="p-4">
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>

           {/* Course Management Skeleton */}
           <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- Right Column Skeleton --- */}
        <div className="md:w-2/3 space-y-8">
          {/* Title and Description */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Author and Stats Line */}
          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>

          {/* What You'll Learn Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-7 w-56" />
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-none pl-5">
              <li><Skeleton className="h-4 w-full" /></li>
              <li><Skeleton className="h-4 w-full" /></li>
              <li><Skeleton className="h-4 w-[90%]" /></li>
              <li><Skeleton className="h-4 w-[95%]" /></li>
            </ul>
          </div>
          
          <Skeleton className="h-px w-full" />

          {/* Course Content (Accordion) Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-7 w-48" />
            <div className="space-y-3">
              {/* Fake Accordion Item 1 */}
              <div className="border border-border rounded-lg bg-muted/40">
                <div className="px-4 py-3"><Skeleton className="h-6 w-3/4" /></div>
              </div>
              {/* Fake Accordion Item 2 */}
              <div className="border border-border rounded-lg bg-muted/40">
                <div className="px-4 py-3"><Skeleton className="h-6 w-1/2" /></div>
              </div>
              {/* Fake Accordion Item 3 */}
              <div className="border border-border rounded-lg bg-muted/40">
                <div className="px-4 py-3"><Skeleton className="h-6 w-2/3" /></div>
              </div>
            </div>
          </div>
          
          <Skeleton className="h-px w-full" />

          {/* Rich Description Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-7 w-64" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[75%]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}