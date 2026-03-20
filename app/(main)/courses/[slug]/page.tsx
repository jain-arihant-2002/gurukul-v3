//Todo: rating logic or remove it 
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import VideoPlayerModalWrapper from "@/components/VideoPlayerModal";
import { Star, Users, Globe, Clock, CheckCircle, BookOpen, AlertCircle, Calendar } from "lucide-react";

import CourseActionPanel from "./_components/CourseActionPanel";
import { getCloudinaryVideoUrl } from "@/utils/helperFunctions";
import { getAuth } from "@/lib/auth/session";
import { getAllPublishedCourseSlugs, getCourseBySlug } from "@/lib/dal";
import LeftSection from "./_components/leftSection";
import RightSection from "./_components/rightSection";



export async function generateStaticParams() {
  const slugs = await getAllPublishedCourseSlugs();

  return slugs.map(({ slug }) => ({
    slug
  }));
}

// function renderStars(rating: number) {
//   const fullStars = Math.floor(rating);
//   const hasHalfStar = rating % 1 !== 0;
//   const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

//   return (
//     <div className="flex items-center gap-1">
//       {/* Full stars */}
//       {Array.from({ length: fullStars }).map((_, i) => (
//         <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//       ))}
//       {/* Half star */}
//       {hasHalfStar && (
//         <div className="relative">
//           <Star className="w-4 h-4 text-gray-300" />
//           <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0"
//             style={{ clipPath: 'inset(0 50% 0 0)' }} />
//         </div>
//       )}
//       {/* Empty stars */}
//       {Array.from({ length: emptyStars }).map((_, i) => (
//         <Star key={i} className="w-4 h-4 text-gray-300" />
//       ))}
//       <span className="text-sm text-muted-foreground ml-1">
//         ({rating.toFixed(1)})
//       </span>
//     </div>
//   );
// }

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {

  const { slug } = await params;
  const course = await getCourseBySlug(slug, 'published');

  if (!course) {
    return (
      <div className="w-[80%] min-h-[80vh] mx-auto my-12 text-center text-destructive text-xl">
        Course not found.
      </div>
    );
  }


  return (
    <section className="w-[80%] mx-auto my-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left section: sticky on scroll */}
        <LeftSection course={course} />


        {/* Right section - remains the same */}
        <RightSection course={course} />
      </div>
    </section >
  );
}