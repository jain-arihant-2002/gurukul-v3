import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { parseTags } from "@/utils/helperFunctions";

// Type for instructor
type Instructor = {
  id: string;
  name: string;
  avatar: string;
  expertise: string; // comma-separated string
  bio: string;
  coursesCount: number;
};

const instructors: Instructor[] = [
  {
    id: "1",
    name: "Ava Patel",
    avatar: "/images/instructors/ava.jpg",
    expertise: "Web Development,React,JavaScript",
    bio: "Senior frontend engineer and passionate educator with 10+ years of experience.",
    coursesCount: 8,
  },
  {
    id: "2",
    name: "Liam Chen",
    avatar: "/images/instructors/liam.jpg",
    expertise: "TypeScript,Backend,Node.js",
    bio: "Backend specialist and open-source contributor, focused on scalable systems.",
    coursesCount: 5,
  },
  {
    id: "3",
    name: "Sophia Lee",
    avatar: "/images/instructors/sophia.jpg",
    expertise: "UI/UX,Design,Web Design",
    bio: "Award-winning designer and mentor, helping students build beautiful interfaces.",
    coursesCount: 6,
  },
  {
    id: "4",
    name: "Noah Smith",
    avatar: "/images/instructors/noah.jpg",
    expertise: "CSS,Responsive Design,Performance",
    bio: "CSS wizard and performance advocate, making the web faster and prettier.",
    coursesCount: 4,
  },
];

export default function TopInstructors() {
  return (
    <section className="py-16 bg-background">
      <div className="w-[80%] mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Top <span className="text-primary">Instructors</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Learn from the best in the industry. Our instructors are experts, mentors, and passionate educators.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((instructor) => (
            <Card key={instructor.id} className="flex flex-col items-center text-center shadow-none border-muted bg-muted/40 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-4 bg-muted flex items-center justify-center relative">
                  <Image
                    src={instructor.avatar}
                    alt={instructor.name}
                    width={64}
                    height={64}
                    className="object-cover w-16 h-16"
                  />
                  {/* Optionally, fallback initials */}
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-primary bg-muted">
                    {instructor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
                <CardTitle className="text-lg font-semibold">{instructor.name}</CardTitle>
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  {parseTags(instructor.expertise).map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-2">{instructor.bio}</p>
                <span className="text-xs text-primary font-medium">
                  {instructor.coursesCount} Courses
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}