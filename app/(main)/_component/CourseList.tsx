import CourseCard from "@/components/CourseCard";
import  { CourseCard as CourseCardType } from "@/utils/types";


const CourseList = ({ Courses,classes }: { Courses: CourseCardType[] ,classes?:string }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${classes}`}>
    {Courses.map((course) => (
      <CourseCard key={course.id} course={course} />
    ))}
  </div>
);

export default CourseList;