"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Video = any;
type Course = any;

function getYoutubeEmbedUrl(url: string) {
  const videoId = url.split("v=")[1]?.split("&")[0];
  return videoId
    ? `https://www.youtube.com/embed/${videoId}`
    : "";
}

export default function CourseViewPage() {
  const { id } = useParams<{ id: string }>();

  const [course, setCourse] = useState<any>(null);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadCourse() {
    setLoading(true);

    const res = await fetch("/api/courses");
    const data = await res.json();

    const found = data.courses.find((c: any) => c.id === id);

    setCourse(found || null);

    if (found?.videos?.length) {
      setCurrentVideo(found.videos[0]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-red-500 font-semibold">Course not found</p>
          <a href="/courses" className="mt-4 inline-block text-blue-600 hover:underline">
            Browse all courses
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* COURSE HEADER */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {course.title}
            </h1>

            <p className="text-gray-600 max-w-3xl">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800">
                {course.category}
              </span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 font-medium text-green-800">
                {course.level}
              </span>
              <span className="text-gray-500">
                {course.videos.length} lectures
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* LEFT: VIDEO AREA */}
          <div className="flex-1">
            {/* VIDEO PLAYER */}
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg">
              {currentVideo && (
                <iframe
                  className="h-full w-full"
                  src={getYoutubeEmbedUrl(
                    currentVideo.youtubeUrl
                  )}
                  title={currentVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* CURRENT VIDEO INFO */}
            <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentVideo?.title}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Lecture {currentVideo?.order}
              </p>
            </div>
          </div>

          {/* RIGHT: SIDEBAR */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-4">
              <div className="border-b px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Course Content
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {course.videos.length} lectures
                </p>
              </div>

              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {course.videos
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((video: any) => {
                    const isActive =
                      currentVideo?.id === video.id;

                    return (
                      <button
                        key={video.id}
                        onClick={() =>
                          setCurrentVideo(video)
                        }
                        className={`w-full border-b px-6 py-4 text-left transition hover:bg-gray-50 ${
                          isActive
                            ? "bg-blue-50 border-l-4 border-l-blue-600"
                            : "border-l-4 border-l-transparent"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                isActive
                                  ? "text-blue-700"
                                  : "text-gray-900"
                              }`}
                            >
                              {video.title}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              Lecture {video.order}
                            </p>
                          </div>

                          {isActive && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                              <svg
                                className="h-3 w-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}