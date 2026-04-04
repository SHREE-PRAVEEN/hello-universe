import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { apiClient } from "@/lib/api";

export const dynamic = "force-dynamic";

type CourseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;

  try {
    const course = await apiClient.getCourse(slug);

    return (
      <PageShell title={course.title} description={course.description}>
        <p className="mb-4 text-sm">Level: {course.level}</p>
        <section className="space-y-3">
          {(course.lessons as Array<{ id: string; order: number; title: string; content: string }>).map((lesson) => (
            <article key={lesson.id} className="rounded-xl border border-black/10 p-4">
              <h3 className="font-semibold">
                Lesson {lesson.order}: {lesson.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{lesson.content}</p>
            </article>
          ))}
        </section>
      </PageShell>
    );
  } catch {
    notFound();
  }
}
