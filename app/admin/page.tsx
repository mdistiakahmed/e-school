"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaPen } from "react-icons/fa6";

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

function getYoutubeThumbnail(url: string) {
  try {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : "https://placehold.co/120x70";
  } catch {
    return "https://placehold.co/120x70";
  }
}

export default function AdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const res = await fetch("/api/courses");
    const data = await res.json();

    setCourses(data.courses || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteCourse(id: string) {
    const ok = confirm("Delete this course?");
    if (!ok) return;

    await fetch("/api/courses", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    load();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-6 lg:p-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Courses
            </h1>
            <p className="text-gray-600">
              Manage your EduTech courses
            </p>
          </div>

          <Link
            href="/admin/courses/new"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            <FaPlus />
            Add New Course
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4">Course</th>
                <th className="p-4">Category</th>
                <th className="p-4">Level</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!loading && courses.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-gray-500"
                  >
                    No courses found
                  </td>
                </tr>
              )}

              {courses.map((course) => {
                const firstVideo =
                  course.videos?.[0];

                const thumbnail = firstVideo
                  ? getYoutubeThumbnail(
                      firstVideo.youtubeUrl
                    )
                  : "https://placehold.co/120x70";

                return (
                  <tr
                    key={course.id}
                    className="border-t"
                  >
                    {/* COURSE INFO */}
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={thumbnail}
                          className="h-16 w-28 rounded-lg object-cover"
                        />

                        <div>
                          <h2 className="font-semibold">
                            {course.title}
                          </h2>

                          <p className="line-clamp-2 text-sm text-gray-500">
                            {course.description}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {course.videos?.length ||
                              0}{" "}
                            lectures
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="p-4 text-gray-700">
                      {course.category}
                    </td>

                    {/* LEVEL */}
                    <td className="p-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">
                        {course.level}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          <FaPen />
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            deleteCourse(course.id)
                          }
                          className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}