import CourseList from "@/components/CourseCard";
import ChooseUs from "./_component/ChooseUs";
import Hero from "./_component/HeroSection";
import TopInstructors from "./_component/TopInstructor";

export default function Home() {
  return (
    <>
    <Hero />
    <ChooseUs />
    <CourseList/>
    <TopInstructors/>
    </>
  );
}
