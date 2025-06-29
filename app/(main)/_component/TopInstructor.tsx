import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { parseTags } from "@/utils/helperFunctions";
import { instructors } from "@/DummyData";

type TopInstructorsProps = {
  limit?: number;
  instructorsList?: typeof instructors;
  showTitle?: boolean;
};

export default function TopInstructors({ limit, instructorsList, showTitle = false }: TopInstructorsProps) {
  const displayInstructors = (instructorsList ?? instructors).slice(0, limit ?? (instructorsList ?? instructors).length);

  return (
    <section className="py-16 bg-background">
      <div className="w-[80%] mx-auto px-4">
        {showTitle && <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Top <span className="text-primary">Instructors</span>
        </h2>}
        {showTitle && <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Learn from the best in the industry. Our instructors are experts, mentors, and passionate educators.
        </p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayInstructors.map((instructor) => (
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