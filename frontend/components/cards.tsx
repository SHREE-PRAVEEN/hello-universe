import Link from "next/link";
import type { Course, Guide, Product, Solution } from "@/types";

const cardClassName =
  "rounded-xl border p-4 backdrop-blur-sm";
const cardStyle = {
  borderColor: "var(--border)",
  background: "color-mix(in srgb, var(--surface) 88%, transparent)",
} as const;
const mutedStyle = { color: "var(--muted)" } as const;
const linkStyle = { color: "color-mix(in srgb, var(--accent-2) 80%, white)" } as const;

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className={cardClassName} style={cardStyle}>
      <h3 className="text-lg font-semibold">{course.title}</h3>
      <p className="mt-2 text-sm" style={mutedStyle}>{course.description}</p>
      <p className="mt-2 text-xs">Level: {course.level}</p>
      <Link className="mt-4 inline-block text-sm font-medium underline" style={linkStyle} href={`/courses/${course.slug}`}>
        View course
      </Link>
    </article>
  );
}

export function SolutionCard({ solution }: { solution: Solution }) {
  return (
    <article className={cardClassName} style={cardStyle}>
      <h3 className="text-lg font-semibold">{solution.title}</h3>
      <p className="mt-2 text-sm" style={mutedStyle}>{solution.problemDescription}</p>
      <p className="mt-2 text-xs">Category: {solution.category}</p>
      <p className="text-xs">Estimated: ${solution.estimatedCost}</p>
      <Link className="mt-4 inline-block text-sm font-medium underline" style={linkStyle} href={`/solutions/${solution.slug}`}>
        View solution
      </Link>
    </article>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className={cardClassName} style={cardStyle}>
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="mt-2 text-sm" style={mutedStyle}>{product.description}</p>
      <p className="mt-2 text-xs">Category: {product.category}</p>
      <p className="text-xs font-medium">${product.price}</p>
      <Link className="mt-4 inline-block text-sm font-medium underline" style={linkStyle} href={`/marketplace/${product.slug}`}>
        View product
      </Link>
    </article>
  );
}

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <article className={cardClassName} style={cardStyle}>
      <h3 className="text-lg font-semibold">{guide.title}</h3>
      <p className="mt-2 text-sm" style={mutedStyle}>{guide.description}</p>
      <p className="mt-2 text-xs">Tags: {guide.tags.join(", ")}</p>
    </article>
  );
}
