import CourseListSkeleton from "@/components/CourseListSkeleton";

export default function Loading() {
  // This UI will be displayed instantly on navigation
  // while the static page.tsx content is being loaded.
  
  return (
    <section className="w-[80%] mx-auto my-12">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Explore All Courses
        </h1>
        {/* We can even use a skeleton for the button if we want */}
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
      </div>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Browse our complete catalog of courses. Use the page bar below to explore
        more!
      </p>

      {/* Here we use our dedicated skeleton component */}
      <CourseListSkeleton count={12} />
    </section>
  );
}