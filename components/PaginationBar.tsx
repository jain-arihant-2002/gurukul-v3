import React from "react";
import Link from "next/link";

interface PaginationBarProps {
  page: number;
  totalPages: number;
  baseHref?: string; // e.g. "/courses/page"
}

const PaginationBar: React.FC<PaginationBarProps> = ({ page, totalPages, baseHref = "" }) => {
  if (totalPages <= 1) return null;

  // Ensure no trailing slash
  const base = baseHref.endsWith("/") ? baseHref.slice(0, -1) : baseHref;

  return (
    <div className="flex justify-center mt-10">
      <nav className="flex gap-2">
        {page === 1 ? (
          <span className="px-3 py-1 rounded bg-muted text-muted-foreground opacity-50 cursor-not-allowed select-none">
            Prev
          </span>
        ) : (
          <Link
            href={`${base}/${page - 1}`}
            className="px-3 py-1 rounded bg-muted text-foreground hover:bg-primary hover:text-white transition"
          >
            Prev
          </Link>
        )}
        {Array.from({ length: totalPages }).map((_, idx) => (
          <Link
            key={idx}
            href={`${base}/${idx + 1}`}
            className={`px-3 py-1 rounded ${
              page === idx + 1
                ? "bg-primary text-white"
                : "bg-muted text-foreground hover:bg-primary hover:text-white"
            } transition`}
            aria-current={page === idx + 1 ? "page" : undefined}
          >
            {idx + 1}
          </Link>
        ))}
        {page === totalPages ? (
          <span className="px-3 py-1 rounded bg-muted text-muted-foreground opacity-50 cursor-not-allowed select-none">
            Next
          </span>
        ) : (
          <Link
            href={`${base}/${page + 1}`}
            className="px-3 py-1 rounded bg-muted text-foreground hover:bg-primary hover:text-white transition"
          >
            Next
          </Link>
        )}
      </nav>
    </div>
  );
};

export default PaginationBar;