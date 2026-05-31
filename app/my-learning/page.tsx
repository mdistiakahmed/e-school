"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Course = any;

export default function MyLearningPage() {
  const { data: session, status } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadEnrolledCourses() {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/user/enrolled?email=${session.user.email}`);
      const data = await res.json();

      if (data.enrolledCourses && data.enrolledCourses.length > 0) {
        const coursesRes = await fetch("/api/courses");
        const coursesData = await coursesRes.json();
        
        const enrolled = coursesData.courses.filter((c: Course) =>
          data.enrolledCourses.includes(c.id)
        );
        
        setCourses(enrolled);
      }
    } catch (error) {
      console.error("Error loading enrolled courses:", error);
    }
    
    setLoading(false);
  }

  useEffect(() => {
    if (status === "authenticated") {
      loadEnrolledCourses();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your enrolled courses</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Login to Continue
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Learning</h1>

        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h2>
            <p className="text-gray-600 mb-6">You haven't enrolled in any courses yet</p>
            <a
              href="/courses"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Browse Courses
            </a>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const firstVideo = course.videos?.[0];
              
              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="relative h-56 bg-gradient-to-br from-blue-500 to-purple-600">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-6xl font-bold opacity-20">
                        {course.category.charAt(0)}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700">
                        {course.level}
                      </span>
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
                        Continue Learning →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}