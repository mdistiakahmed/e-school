"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getYoutubeThumbnail } from "@/utils/CommonFun";
import { useLoginModal } from "@/context/LoginModalContext";

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

type HomeCourseGridProps = {
  courses: Course[];
};

export default function HomeCourseGrid({ courses }: HomeCourseGridProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { openLoginModal } = useLoginModal();

  function handleCourseClick(courseId: string) {
    const href = `/courses/${courseId}`;

    if (status === "loading") return;

    if (session) {
      router.push(href);
      return;
    }

    openLoginModal({
      callbackUrl: href,
      title: "Sign in to start learning",
      description: "Log in with Google to open this course and track your progress.",
    });
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => {
        const firstVideo = course.videos?.[0];
        const thumbnail = firstVideo
          ? getYoutubeThumbnail(firstVideo.youtubeUrl)
          : "https://placehold.co/600x400";

        return (
          <button
            key={course.id}
            type="button"
            onClick={() => handleCourseClick(course.id)}
            className="group overflow-hidden rounded-3xl border border-gray-200 bg-white text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
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
          </button>
        );
      })}
    </div>
  );
}
