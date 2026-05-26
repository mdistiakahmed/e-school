import Link from "next/link";

type Video = {
  id: string;
  youtubeUrl: string;
  title: string;
  order: number;
};

type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  videos: Video[];
};

function getYoutubeThumbnail(url: string) {
  try {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : "https://placehold.co/600x400";
  } catch {
    return "https://placehold.co/600x400";
  }
}

// Server Component (best for SEO + speed)
export default async function HomePage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();

  const courses: Course[] = (data.courses || []).slice(
    0,
    10
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Learn Modern Tech Skills with EduTech
          </h1>

          <p className="mt-4 text-gray-600">
            High-quality curated courses using real-world YouTube lectures
          </p>

          <div className="mt-6">
            <Link
              href="/admin"
              className="inline-block rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              Go to Admin Panel
            </Link>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Top Courses
          </h2>

          <span className="text-sm text-gray-500">
            Showing top 10 courses
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const firstVideo =
              course.videos?.[0];

            const thumbnail = firstVideo
              ? getYoutubeThumbnail(
                  firstVideo.youtubeUrl
                )
              : "https://placehold.co/600x400";

            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
              >
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={thumbnail}
                    alt={course.title}
                    className="h-48 w-full object-cover transition group-hover:scale-105"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                    {course.level}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {course.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {course.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-blue-600 font-medium">
                      {course.category}
                    </span>

                    <span className="text-xs text-gray-500">
                      {course.videos?.length || 0} lectures
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}