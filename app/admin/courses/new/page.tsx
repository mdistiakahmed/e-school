"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { categories } from "@/utils/Constants";


export default function NewCoursePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Tech & Coding",
    level: "Beginner",
    videos: [""],
  });

  function addLectureField() {
    setForm({
      ...form,
      videos: [...form.videos, ""],
    });
  }

  function removeLectureField(index: number) {
    const updatedVideos = [...form.videos];

    updatedVideos.splice(index, 1);

    setForm({
      ...form,
      videos: updatedVideos,
    });
  }

  function updateVideo(index: number, value: string) {
    const updatedVideos = [...form.videos];

    updatedVideos[index] = value;

    setForm({
      ...form,
      videos: updatedVideos,
    });
  }

  async function handleSubmit() {
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        level: form.level,

        videos: form.videos
          .filter((url) => url.trim() !== "")
          .map((url, index) => ({
            id: crypto.randomUUID(),
            title: `Lecture ${index + 1}`,
            youtubeUrl: url,
            order: index + 1,
          })),
      };

      await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      router.push("/admin");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl p-6 lg:p-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Course
            </h1>

            <p className="mt-2 text-gray-600">
              Add a new course with YouTube lectures
            </p>
          </div>

          {/* Form */}
          <div className="mt-10 space-y-8">
            {/* Course Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Course Title
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Next.js 16 Complete Course"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                rows={5}
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Write course description..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            {/* Category + Level */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Level
                </label>

                <select
                  value={form.level}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      level: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            {/* Lecture URLs */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Lecture Videos
                  </h2>

                  <p className="text-sm text-gray-500">
                    Add YouTube lecture URLs
                  </p>
                </div>

              </div>

              <div className="space-y-4">
                {form.videos.map((video, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-1">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Lecture {index + 1} URL
                      </label>

                      <input
                        type="text"
                        value={video}
                        onChange={(e) => updateVideo(index, e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                      />
                    </div>

                    {form.videos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLectureField(index)}
                        className="mt-8 h-12 rounded-xl bg-red-50 px-4 text-red-600 transition hover:bg-red-100"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 ">
                <button
                  type="button"
                  onClick={addLectureField}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  <FaPlus className="text-xs" />
                  Add More Lecture
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4 border-t border-gray-200 pt-6">
              <button
                onClick={() => router.push("/admin")}
                className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={handleSubmit}
                className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Course"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
