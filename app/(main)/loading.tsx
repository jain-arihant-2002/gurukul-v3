import CourseListSkeleton from "../../components/CourseListSkeleton";
import ChooseUs from "./_component/ChooseUs";
import Hero from "./_component/HeroSection";
import InstructorListSkeleton from "@/components/InstructorListSkeleton";

export default function Loading() {
  // This UI is shown instantly while the data in page.tsx is being fetched.
  return (
    <>
      {/* 
        Render static components immediately for a faster perceived load.
        The user sees the top half of the page while the bottom half loads.
      */}
      <Hero />
      <ChooseUs />

      {/* Skeleton for "Featured Courses" */}
      <section className="w-[80%] mx-auto my-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-foreground">
          Featured Courses
        </h2>
        <CourseListSkeleton count={3} />
      </section>

      {/* Skeleton for "Top Instructors" */}
      <section className="py-16 bg-background">
        <div className="w-[80%] mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Top <span className="text-primary">Instructors</span>
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Learn from the best in the industry. Our instructors are experts, mentors, and passionate educators.
          </p>
          <InstructorListSkeleton count={4} />
        </div>
      </section>
    </>
  );
}