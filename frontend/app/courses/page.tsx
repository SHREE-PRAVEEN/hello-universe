import { CourseCard } from "@/components/cards";
import { PageShell } from "@/components/page-shell";
import { SearchForm } from "@/components/search-form";
import { apiClient } from "@/lib/api";
import type { Course } from "@/types";

export const dynamic = "force-dynamic";

type CoursesPageProps = {
  searchParams: Promise<{ search?: string }>;
};

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  const courses: Course[] = await apiClient.getCourses(params.search);

  return (
    <PageShell title="Courses" description="Structured robotics curriculum with practical lessons.">
      <SearchForm placeholder="Search courses" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </PageShell>
  );
}
