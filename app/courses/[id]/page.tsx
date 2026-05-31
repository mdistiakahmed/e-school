"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLoginModal } from "@/context/LoginModalContext";

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
  const router = useRouter();
  const { data: session, status } = useSession();
  const { openLoginModal } = useLoginModal();

  const [course, setCourse] = useState<any>(null);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

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

  async function checkEnrollment() {
    if (session?.user?.email) {
      const res = await fetch(`/api/user/enrolled?email=${session.user.email}`);
      const data = await res.json();
      setEnrolled(data.enrolledCourses?.includes(id) || false);
    }
  }

  async function handleEnroll() {
    if (!session?.user?.email) {
      openLoginModal({
        callbackUrl: `/courses/${id}`,
        title: "Sign in to enroll",
        description: "Log in with Google to enroll in this course.",
      });
      return;
    }

    setEnrolling(true);
    try {
      await fetch("/api/user/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          courseId: id,
        }),
      });
      setEnrolled(true);
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
    setEnrolling(false);
  }

  useEffect(() => {
    loadCourse();
  }, [id]);

  useEffect(() => {
    if (session?.user?.email) {
      checkEnrollment();
    }
  }, [session, id]);

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

  // Show login prompt if not logged in
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="mt-2 text-gray-600 max-w-3xl">{course.description}</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-600 mb-6">Please login to view this course content</p>
            <button
              type="button"
              onClick={() =>
                openLoginModal({
                  callbackUrl: `/courses/${id}`,
                  title: "Sign in to view this course",
                  description:
                    "Log in with Google to access lessons and enroll in this course.",
                })
              }
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Login to Continue
            </button>
          </div>
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

            {/* Enroll Button */}
            {!enrolled ? (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enrolling ? "Enrolling..." : "Enroll for Free"}
              </button>
            ) : (
              <div className="mt-4 px-8 py-3 bg-green-100 text-green-800 rounded-xl font-semibold inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Enrolled
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - Only show if enrolled */}
      {enrolled ? (
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
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enroll to Access</h2>
            <p className="text-gray-600 mb-6">Please enroll in this course to view the content</p>
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enrolling ? "Enrolling..." : "Enroll for Free"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}