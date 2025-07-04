import { InstructorCard } from "@/components/InstructorCard";
import type { InstructorCard as InstructorCardType } from "@/utils/types";

// Instructor List
type InstructorsProps = {
    Instructors: InstructorCardType[];
};

export default function InstructorList({ Instructors }: InstructorsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Instructors.map((instructor) => (
                <InstructorCard instructor={instructor} key={instructor.id} />
            ))}
        </div>
    );
}