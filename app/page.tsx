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
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses`, {
    cache: "no-store",
  });

  const data = await res.json();

  const courses: Course[] = (data.courses || []).slice(0, 10);

  type Review = {
    id: number;
    name: string;
    role: string;
    review: string;
  };

  const reviews: Review[] = [
  {
    id: 1,
    name: "Rahim Ahmed",
    role: "HSC Science Student",
    review:
      "e-School has made my Physics and Mathematics preparation much easier. The step-by-step video explanations and clear concepts helped me improve my exam results. এখন আমি অনেক আত্মবিশ্বাসের সাথে problem solve করতে পারি।",
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    role: "University Student (BBA)",
    review:
      "The Business Studies and English communication courses are very practical and easy to understand. Real-life examples and structured lessons helped me improve my presentation and writing skills. এখন আমার academic performance অনেক better হয়েছে।",
  },
  {
    id: 3,
    name: "Sabbir Hasan",
    role: "SSC Student",
    review:
      "I really like how flexible the learning system is. I can study anytime from my mobile phone, even on the way to school. ভিডিও লেসনগুলো ছোট এবং সহজভাবে explain করা, so it’s very effective for me.",
  },
  {
    id: 4,
    name: "Tanvir Islam",
    role: "Job Seeker",
    review:
      "The communication, English speaking, and interview preparation courses were extremely helpful for my job preparation. I feel much more confident now in interviews. আগে আমি nervous হতাম, but now I can express myself clearly.",
  },
  {
    id: 5,
    name: "Farzana Akter",
    role: "Parent",
    review:
      "As a parent, I am very satisfied with e-School. My daughter enjoys the video lessons and quizzes, and her study habit has improved a lot. এখন সে নিজে থেকেই নিয়মিত পড়াশোনা করে এবং শেখার প্রতি আগ্রহী হয়ে উঠেছে।",
  },
];

  return (
    <main className="min-h-screen ">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/images/bengali-pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "400px",
          }}
        />

        <div className="relative bg-white/70 mx-auto max-w-7xl px-6 py-12 my-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            🇧🇩 বাংলাদেশের শিক্ষার্থীদের জন্য আগামী দিনের স্কিলস প্ল্যাটফর্ম
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-gray-900 md:text-7xl max-w-4xl mx-auto leading-tight">
            Your Launchpad for Success
            <span className="block text-blue-600 mt-2">with Basecamp</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
            Master in-demand skills, bridge the gap between academics and industry, 
            and learn from top-tier mentors. Start your journey from basic to breakthrough.
          </p>

          {/* CTA */}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#courses"
              className="rounded-xl border border-gray-300 bg-white px-8 py-4 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Start Learning Now
            </Link>
          </div>

          {/* Categories */}
          <div className="mt-16 flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {[
              "Tech & Coding",
              "Business & Marketing",
              "Academic Support",
              "Language Learning",
              "Creative Arts",
              "Career Readiness",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 hover:ring-blue-300 transition cursor-default"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Top Courses</h2>

          <span className="text-sm text-gray-500">Showing top 10 courses</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const firstVideo = course.videos?.[0];

            const thumbnail = firstVideo
              ? getYoutubeThumbnail(firstVideo.youtubeUrl)
              : "https://placehold.co/600x400";

            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={thumbnail}
                    alt={course.title}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    {course.level}
                  </div>

                  <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
                    ▶
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {course.category}
                    </span>
                  </div>

                  <h3 className="line-clamp-2 text-xl font-bold text-gray-900">
                    {course.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-gray-600">
                    {course.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <span className="text-sm text-gray-500">
                      {course.videos?.length || 0} lectures
                    </span>

                    <span className="font-semibold text-blue-600">
                      Start Learning →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden  py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              Student Success Stories
            </span>

            <h2 className="mt-6 text-4xl font-bold text-gray-900">
              What Our Learners Say
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600 bg-white">
              Thousands of learners are improving their knowledge and skills
              through e-School.
            </p>
          </div>

          <div className="group mt-12 relative">
            <div className="animate-marquee flex gap-6">
              {[...reviews, ...reviews].map((review, index) => (
                <div
                  key={index}
                  className="max-w-[350px] rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                      {review.name.charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {review.name}
                      </h3>

                      <p className="text-sm text-gray-500">{review.role}</p>
                    </div>
                  </div>

                  <p className="leading-7 text-gray-600">"{review.review}"</p>

                  <div className="mt-4 text-yellow-500">⭐⭐⭐⭐⭐</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
