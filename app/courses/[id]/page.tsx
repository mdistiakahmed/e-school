"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Video = {
  id: string;
  title: string;
  youtubeUrl: string;
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

function getYoutubeEmbedUrl(url: string) {
  const videoId = url.split("v=")[1]?.split("&")[0];
  return videoId
    ? `https://www.youtube.com/embed/${videoId}`
    : "";
}

export default function CourseViewPage() {
  const { id } = useParams<{ id: string }>();

  const [course, setCourse] = useState<Course | null>(
    null
  );

  const [currentVideo, setCurrentVideo] =
    useState<Video | null>(null);

  const [loading, setLoading] = useState(true);

  async function loadCourse() {
    setLoading(true);

    const res = await fetch("/api/courses");
    const data = await res.json();

    const found = data.courses.find(
      (c: Course) => c.id === id
    );

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
      <div className="p-10 text-gray-500">
        Loading course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-10 text-red-500">
        Course not found
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 lg:flex-row">
      {/* LEFT: VIDEO AREA */}
      <div className="flex-1 p-6">
        {/* VIDEO PLAYER */}
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
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

        {/* COURSE INFO */}
        <div className="mt-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {course.title}
          </h1>

          <p className="mt-2 text-gray-600">
            {course.description}
          </p>

          <div className="mt-3 flex gap-3 text-sm text-gray-500">
            <span>{course.category}</span>
            <span>•</span>
            <span>{course.level}</span>
            <span>•</span>
            <span>
              {course.videos.length} lectures
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: SIDEBAR */}
      <div className="w-full border-t bg-white lg:w-[380px] lg:border-l lg:border-t-0">
        <div className="p-4">
          <h2 className="text-lg font-semibold">
            Course Content
          </h2>

          <p className="text-sm text-gray-500">
            {course.videos.length} lectures
          </p>
        </div>

        <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
          {course.videos
            .sort((a, b) => a.order - b.order)
            .map((video) => {
              const isActive =
                currentVideo?.id === video.id;

              return (
                <button
                  key={video.id}
                  onClick={() =>
                    setCurrentVideo(video)
                  }
                  className={`w-full border-t px-4 py-4 text-left transition ${
                    isActive
                      ? "bg-blue-50 border-l-4 border-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
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
                      <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}