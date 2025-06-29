"use client";
import { useState } from "react";
import CourseList from "@/components/CourseCard";
import { courses } from "@/DummyData";

const COURSES_PER_PAGE = 12;

export default function AllCoursesPage() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(courses.length / COURSES_PER_PAGE);
  const paginatedCourses = courses.slice(
    (page - 1) * COURSES_PER_PAGE,
    page * COURSES_PER_PAGE
  );

  return (
    <section className="w-[80%] mx-auto my-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
        Explore All Courses
      </h1>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Browse our complete catalog of courses. Use the page bar below to explore more!
      </p>
      <CourseList courses={paginatedCourses} />
      {/* Pagination Bar */}
      <div className="flex justify-center mt-10">
        <nav className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-muted text-foreground hover:bg-primary hover:text-white transition disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 rounded ${
                page === idx + 1
                  ? "bg-primary text-white"
                  : "bg-muted text-foreground hover:bg-primary hover:text-white"
              } transition`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-muted text-foreground hover:bg-primary hover:text-white transition disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </nav>
      </div>
    </section>
  );
}