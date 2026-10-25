import type { Metadata } from "next";
import CourseList from './_component/CourseList';
import ChooseUs from "./_component/ChooseUs";
import Hero from "./_component/HeroSection";
import InstructorList from "./_component/InstructorList";
import { getCoursesCard, getInstructorCard } from '@/lib/dal';
import { JsonLd } from "@/components/JsonLd";
import { DEFAULT_DESCRIPTION, HOME_TITLE, organizationJsonLd, socialMetadata, websiteJsonLd } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  ...socialMetadata({ title: HOME_TITLE, description: DEFAULT_DESCRIPTION, path: "/" }),
};

export default async function Home() {
  const Courses = await getCoursesCard({ limit: 3 });
  const Instructors = await getInstructorCard({ limit: 4 });

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <Hero />
      <ChooseUs />
      {Courses.length > 0 &&
        <section className="w-[80%] mx-auto my-12" aria-labelledby="featured-courses">
          <h2 id="featured-courses" className="text-3xl font-bold mb-3 text-center text-foreground">
            Featured Gurukul Courses
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            A selection of the most popular Gurukul courses, taught by instructors who
            have shipped real work in the field.
          </p>
          <CourseList Courses={Courses} />
          <p className="text-center mt-8">
            <Link href="/courses/page/1" className="text-primary font-medium hover:underline">
              Browse all Gurukul courses
            </Link>
          </p>
        </section>}
      {Instructors.length > 0 &&
        <section className="py-16 bg-background" aria-labelledby="top-instructors">
          <div className="w-[80%] mx-auto px-4">
            <h2 id="top-instructors" className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              Top <span className="text-primary">Gurukul Instructors</span>
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
              Learn from the best in the industry. Every Gurukul instructor is an expert,
              mentor, and passionate educator — browse their profiles to see what they teach.
            </p>
            <InstructorList Instructors={Instructors} />
            <p className="text-center mt-12">
              <Link href="/instructors/page/1" className="text-primary font-medium hover:underline">
                See all Gurukul instructors
              </Link>
            </p>
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
