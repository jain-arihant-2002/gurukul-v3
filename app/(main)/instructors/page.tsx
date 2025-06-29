"use client";
import { useState } from "react";
import TopInstructors from "../_component/TopInstructor";
import { instructors } from "@/DummyData";

const INSTRUCTORS_PER_PAGE = 12;

export default function AllInstructorsPage() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(instructors.length / INSTRUCTORS_PER_PAGE);
  const paginatedInstructors = instructors.slice(
    (page - 1) * INSTRUCTORS_PER_PAGE,
    page * INSTRUCTORS_PER_PAGE
  );

  return (
    <section className="w-[80%] mx-auto my-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
        Meet Our Top Instructors
      </h1>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Explore our talented and experienced instructors. Use the page bar below to discover more!
      </p>
      <TopInstructors instructorsList={paginatedInstructors} showTitle={false} />
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