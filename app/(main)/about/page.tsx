"use client";

const aboutSections = [
  {
    icon: <span className="text-3xl mb-4">🎯</span>,
    title: "Our Mission",
    description:
      "To democratize education by connecting passionate instructors with eager learners, fostering growth and innovation.",
  },
  {
    icon: <span className="text-3xl mb-4">🤝</span>,
    title: "Our Community",
    description:
      "We believe in the power of community. Gurukul brings together people from all backgrounds to learn, share, and succeed together.",
  },
  {
    icon: <span className="text-3xl mb-4">🚀</span>,
    title: "Our Vision",
    description:
      "To become the go-to platform for lifelong learning, personal development, and professional growth.",
  },
];

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="py-16 bg-background">
      <div className="w-[80%] mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6 text-center text-foreground">
          About <span className="text-primary">Gurukul</span>
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          Gurukul is a modern, community-driven learning platform designed to empower both educators and learners. Our mission is to make high-quality education accessible, engaging, and collaborative for everyone, everywhere.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {aboutSections.map((section, idx) => (
            <Card
              key={idx}
              className="flex flex-col items-center text-center shadow-none border-muted bg-muted/40 hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-col items-center">
                {section.icon}
                <CardTitle className="text-xl font-semibold whitespace-nowrap">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{section.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4 text-foreground">Join Us On Our Journey</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Whether you’re an instructor looking to share your expertise or a learner eager to grow, Gurukul is your home for knowledge and inspiration.
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-8 py-3 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}