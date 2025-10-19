import LoadingLinkButton from "@/components/LoadingLinkButton";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 bg-background overflow-hidden">
      {/* Soft edge gradient overlays */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Top left soft gradient */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-full blur-3xl opacity-40" />
        {/* Bottom right soft gradient */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tl from-orange-400/20 via-transparent to-transparent rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative z-10 max-w-2xl text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
          Unlock Your Potential with{" "}
          <span className="text-primary">Gurukul</span>
        </h1>
        <p className="text-lg md:text-2xl text-muted-foreground mb-8">
          The modern LMS platform for educators and learners. Create, share, and
          grow your knowledge in a beautiful, collaborative environment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LoadingLinkButton  href="/courses/page/1" size="lg">
            Browse Courses
          </LoadingLinkButton>

          <LoadingLinkButton asChild href="/sign-up" variant="outline" size="lg">
            Get Started
          </LoadingLinkButton>
        </div>
      </div>
    </section>
  );
}