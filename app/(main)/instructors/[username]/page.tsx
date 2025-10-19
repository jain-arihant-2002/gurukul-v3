import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import CourseCard from "@/components/CourseCard";
import { getInstructorByUsername } from "@/lib/dal";
import { Twitter, Linkedin, Github, Globe, Users, BookOpen, Calendar } from "lucide-react";
import EditProfileBtn from "./_component/editProfileBtn";
import Link from "next/link";

export default async function InstructorDetailPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const instructor = await getInstructorByUsername(username);
  if (!instructor) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Card className="text-center">
            <CardContent className="pt-12 pb-12">
              <h1 className="text-3xl font-bold mb-4">Instructor Not Found</h1>
              <p className="text-muted-foreground">The instructor you're looking for doesn't exist or has been removed.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Convert array of social links to a usable format
  const socialLinks = Array.isArray(instructor.socialLinks)
    ? instructor.socialLinks.reduce((acc, link) => {
      acc[link.platform] = link.url;
      return acc;
    }, {} as Record<string, string>)
    : {};

  // Calculate total students across all published courses only
  const publishedCourses = instructor.courses?.filter(course => course.status === 'published') || [];
  const totalStudents = publishedCourses.reduce((acc, course) => acc + (course.enrollmentCount || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Profile Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardContent className="pt-6">
                  {/* Avatar and Basic Info */}
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-32 h-32 mb-4 border-4 border-background shadow-lg">
                      <AvatarImage src={instructor.avatarUrl || "/default-avatar.png"} alt={instructor.name} />
                      <AvatarFallback className="text-2xl font-bold">
                        {instructor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <h1 className="text-2xl font-bold mb-2">
                      {instructor.name}
                    </h1>
                    <p className="text-muted-foreground mb-3">
                      @{instructor.username}
                    </p>

                    {/* Headline */}
                    {instructor.headline && (
                      <p className="text-primary font-medium mb-4 text-lg">
                        {instructor.headline}
                      </p>
                    )}

                    {/* Edit Profile Button */}
                    <Link href={`/instructors/${instructor.username}/edit`}>
                      <EditProfileBtn username={instructor.username} />
                    </Link>

                    {/* Social Links */}
                    <div className="flex gap-3 mb-6 mt-4">
                      {socialLinks.twitter && (
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                          className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 transition-colors">
                          <Twitter className="w-5 h-5 text-blue-500" />
                        </a>
                      )}
                      {socialLinks.linkedin && (
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                          className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 transition-colors">
                          <Linkedin className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                        </a>
                      )}
                      {socialLinks.github && (
                        <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                          className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-muted hover:bg-muted/80 transition-colors">
                          <Github className="w-5 h-5 text-muted-foreground" />
                        </a>
                      )}
                      {socialLinks.website && (
                        <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" aria-label="Website"
                          className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900 transition-colors">
                          <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </a>
                      )}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Statistics */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Statistics</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="text-center">
                        <CardContent className="pt-4 pb-4">
                          <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold text-primary">{instructor.coursesCount}</p>
                          <p className="text-sm text-muted-foreground">Courses</p>
                        </CardContent>
                      </Card>
                      <Card className="text-center">
                        <CardContent className="pt-4 pb-4">
                          <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                          <p className="text-2xl font-bold text-primary">{totalStudents}</p>
                          <p className="text-sm text-muted-foreground">Students</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Join Date */}
                  <div className="text-center">
                    <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Teaching since {new Date(instructor.createdAt).getFullYear()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right: Content Sections - No Background */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                <h2 className="text-3xl font-bold">About {instructor.name}</h2>
              </div>
              <p className="text-lg leading-relaxed text-foreground pl-7">
                {instructor.bio}
              </p>
            </div>

            {/* Expertise Section */}
            {instructor.expertise && instructor.expertise.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-1 h-8 bg-primary rounded-full"></span>
                  <h2 className="text-3xl font-bold">Expertise</h2>
                </div>
                <div className="flex flex-wrap gap-2 pl-7">
                  {instructor.expertise.map((exp: string) => (
                    <Badge key={exp} variant="secondary" className="text-sm">
                      {exp}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Courses Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                <h2 className="text-3xl font-bold">Courses by {instructor.name}</h2>
              </div>
              <div className="pl-7">
                {publishedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {publishedCourses.map((course, idx) => (
                      <CourseCard key={course.id || idx} course={course} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Published Courses Yet</h3>
                    <p className="text-muted-foreground">
                      {instructor.name} hasn't published any courses yet. Check back later for new content!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}