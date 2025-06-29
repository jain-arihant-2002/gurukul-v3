import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { parseTags } from "@/utils/helperFunctions";

// Define the type for a course
export type Course = {
  id: string;
  title: string;
  coverImage: string;
  category: string; // comma-separated string of tags
  price: number;
  updatedAt: string; // ISO string
};

const courses: Course[] = [
  {
    id: "1",
    title: "Web Development Bootcamp",
    coverImage: "https://1.bp.blogspot.com/-ttR6sFIgYJw/YHWVnJF1t2I/AAAAAAAAABo/WJWwOLtIH34XRBtuWTWOjX-19_QER92cACPcBGAYYCw/s16000/Learn+Web+Develpoment+TBN.png",
    category: "Web Development,HTML,CSS,JavaScript",
    price: 99,
    updatedAt: "2025-06-28T12:00:00Z",
  },
  {
    id: "2",
    title: "Learn Web Design from Scratch",
    coverImage: "https://1.bp.blogspot.com/-ttR6sFIgYJw/YHWVnJF1t2I/AAAAAAAAABo/WJWwOLtIH34XRBtuWTWOjX-19_QER92cACPcBGAYYCw/s16000/Learn+Web+Develpoment+TBN.png",category: "Web Design,UI/UX,HTML,CSS",
    price: 89,
    updatedAt: "2025-06-25T09:30:00Z",
  },
  {
    id: "3",
    title: "JavaScript Essentials",
    coverImage: "https://1.bp.blogspot.com/-ttR6sFIgYJw/YHWVnJF1t2I/AAAAAAAAABo/WJWwOLtIH34XRBtuWTWOjX-19_QER92cACPcBGAYYCw/s16000/Learn+Web+Develpoment+TBN.png",category: "JavaScript,Programming,Frontend",
    price: 59,
    updatedAt: "2025-06-20T10:00:00Z",
  },
  {
    id: "4",
    title: "Responsive Web Design",
    coverImage: "https://1.bp.blogspot.com/-ttR6sFIgYJw/YHWVnJF1t2I/AAAAAAAAABo/WJWwOLtIH34XRBtuWTWOjX-19_QER92cACPcBGAYYCw/s16000/Learn+Web+Develpoment+TBN.png",
    category: "Responsive,Web Design,Mobile,CSS",
    price: 79,
    updatedAt: "2025-06-18T14:30:00Z",
  },
  {
    id: "5",
    title: "Advanced CSS Techniques",
    coverImage: "https://1.bp.blogspot.com/-ttR6sFIgYJw/YHWVnJF1t2I/AAAAAAAAABo/WJWwOLtIH34XRBtuWTWOjX-19_QER92cACPcBGAYYCw/s16000/Learn+Web+Develpoment+TBN.png",
    category: "CSS,Web Development,Advanced",
    price: 69,
    updatedAt: "2025-06-15T16:45:00Z",
  },
];


function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function CourseList() {
  return (
    <section className="w-[80%] mx-auto my-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-foreground">
        Featured Courses
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader className="p-0">
              <div className="relative w-full h-40 rounded-t-md overflow-hidden">
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="object-cover w-full h-full"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {parseTags(course.category).map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                <span className="ml-auto text-xs text-muted-foreground">
                  Updated: {formatDate(course.updatedAt)}
                </span>
              </div>
              <CardTitle className="text-base font-semibold mt-2">{course.title}</CardTitle>
              <div className="mt-2 text-lg font-bold text-primary">${course.price}</div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/courses/${course.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}