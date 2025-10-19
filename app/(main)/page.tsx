import CourseList from './_component/CourseList';
import ChooseUs from "./_component/ChooseUs";
import Hero from "./_component/HeroSection";
import InstructorList from "./_component/InstructorList";
import { getCoursesCard, getInstructorCard } from '@/lib/dal';
/* import { cleanupData,seedDatabaseWithAllFields } from '@/seed';
import { updateCourseImages, updateInstructorAvatars } from '@/updateImage'; */

export default async function Home() {
  const Courses = await getCoursesCard({ limit: 3 });
  const Instructors = await getInstructorCard({ limit: 4 });

  console.time("blockingTask");
  // cleanupData()  
  // seedDatabaseWithAllFields()  
  // updateInstructorAvatars()
  // updateCourseImages()
  console.timeEnd("blockingTask");
  // Todo: Add a loading state or skeleton while fetching data or add logic for suspense
  return (
    <>
      <Hero />
      <ChooseUs />
      {Courses.length > 0 &&
        <section className="w-[80%] mx-auto my-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">
            Featured Courses
          </h2>
          <CourseList Courses={Courses} />

        </section>}
      {Instructors.length > 0 &&
        <section className="py-16 bg-background">
          <div className="w-[80%] mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              Top <span className="text-primary">Instructors</span>
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Learn from the best in the industry. Our instructors are experts, mentors, and passionate educators.
            </p>
            <InstructorList Instructors={Instructors} />
          </div>
        </section>
      }
    </>
  );
}



//todo: make pagination bar have some logic to limit the number shown and it is not shown if 1 page course only.
// add section and lecture logic.
// register as teacher logic.
//  privacy policy page.