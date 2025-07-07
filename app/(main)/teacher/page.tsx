import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function JoinAsTeacherPage() {
  return (
    <section className="py-16 bg-background min-h-[80vh] flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full max-w-2xl px-4 text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
          Join Us as a <span className="text-primary">Teacher</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-10">
          Share your knowledge and inspire learners around the world. Become a part of our passionate teaching community and help shape the future of education.
        </p>
        <Link href="/instructors/register">
          <Button size="lg" className="text-lg px-8 py-4">
            Become a Teacher
          </Button>
        </Link>
      </div>

      {/* Benefits Section */}
      <div className="w-full max-w-4xl px-4 mb-20">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-foreground">
          Why Teach With Us?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-muted rounded-lg p-6 shadow text-center flex flex-col items-center">
            <h3 className="font-bold text-lg mb-2 text-primary">Global Reach</h3>
            <p className="text-muted-foreground">
              Connect with thousands of eager learners from all over the world and make a real impact.
            </p>
          </div>
          <div className="bg-muted rounded-lg p-6 shadow text-center flex flex-col items-center">
            <h3 className="font-bold text-lg mb-2 text-primary">Flexible Schedule</h3>
            <p className="text-muted-foreground">
              Teach at your own pace and on your own terms—full-time, part-time, or just for fun.
            </p>
          </div>
          <div className="bg-muted rounded-lg p-6 shadow text-center flex flex-col items-center">
            <h3 className="font-bold text-lg mb-2 text-primary">Earn & Grow</h3>
            <p className="text-muted-foreground">
              Get rewarded for your expertise and grow your personal brand as an educator.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full max-w-2xl px-4 mb-20">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-foreground">
          How It Works
        </h2>
        <ol className="list-decimal list-inside space-y-4 text-muted-foreground text-lg mx-auto text-left max-w-xl">
          <li>
            <span className="font-semibold text-foreground">Apply:</span> Click &quot;Become a Teacher&quot; and fill out your profile.
          </li>
          <li>
            <span className="font-semibold text-foreground">Create Courses:</span> Design engaging courses and upload your content.
          </li>
          <li>
            <span className="font-semibold text-foreground">Start Teaching:</span> Go live and interact with your students!
          </li>
        </ol>
      </div>

      {/* Call to Action Section */}
      <div className="w-full max-w-2xl px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
          Ready to Inspire?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Take the first step towards making a difference. Join our teaching community today!
        </p>
        <Link href="/instructors/register">
          <Button size="lg" className="text-lg px-8 py-4">
            Become a Teacher
          </Button>
        </Link>
      </div>
    </section>
  );
}