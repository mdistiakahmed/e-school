"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { categories } from "@/utils/Constants";

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

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<Course | null>(null);

  // LOAD COURSE
  async function loadCourse() {
    setLoading(true);

    const res = await fetch("/api/courses");
    const data = await res.json();

    const course = data.courses.find(
      (c: Course) => c.id === id
    );

    setForm(course || null);
    setLoading(false);
  }

  useEffect(() => {
    loadCourse();
  }, [id]);

  // VIDEO HANDLERS
  function updateVideo(
    index: number,
    value: string
  ) {
    if (!form) return;

    const updated = [...form.videos];

    updated[index].youtubeUrl = value;

    setForm({
      ...form,
      videos: updated,
    });
  }

  function addLecture() {
    if (!form) return;

    setForm({
      ...form,
      videos: [
        ...form.videos,
        {
          id: crypto.randomUUID(),
          title: `Lecture ${form.videos.length + 1}`,
          youtubeUrl: "",
          order: form.videos.length + 1,
        },
      ],
    });
  }

  function removeLecture(index: number) {
    if (!form) return;

    const updated = [...form.videos];

    updated.splice(index, 1);

    // reorder
    const reordered = updated.map((v, i) => ({
      ...v,
      order: i + 1,
      title: `Lecture ${i + 1}`,
    }));

    setForm({
      ...form,
      videos: reordered,
    });
  }

  // SAVE
  async function handleSave() {
    if (!form) return;

    setSaving(true);

    await fetch("/api/courses", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setSaving(false);

    router.push("/admin");
  }

  if (loading) {
    return (
      <div className="p-10 text-gray-500">
        Loading course...
      </div>
    );
  }

  if (!form) {
    return (
      <div className="p-10 text-red-500">
        Course not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl p-6 lg:p-10">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          {/* Header */}
          <h1 className="text-3xl font-bold">
            Edit Course
          </h1>

          <p className="mt-2 text-gray-600">
            Update course information
          </p>

          <div className="mt-8 space-y-6">
            {/* TITLE */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Course Title
              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                className="w-full rounded-xl border p-3"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-xl border p-3"
                rows={5}
              />
            </div>

            {/* CATEGORY + LEVEL */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
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
                  className="w-full rounded-xl border p-3"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
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
                  className="w-full rounded-xl border p-3"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            {/* VIDEOS */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Lectures
                </h2>

                <button
                  onClick={addLecture}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white"
                >
                  <FaPlus />
                  Add Lecture
                </button>
              </div>

              <div className="space-y-4">
                {form.videos.map((video, index) => (
                  <div
                    key={video.id}
                    className="flex gap-3"
                  >
                    <div className="flex-1">
                      <label className="mb-1 block text-sm">
                        Lecture {index + 1}
                      </label>

                      <input
                        value={video.youtubeUrl}
                        onChange={(e) =>
                          updateVideo(
                            index,
                            e.target.value
                          )
                        }
                        placeholder="YouTube URL"
                        className="w-full rounded-xl border p-3"
                      />
                    </div>

                    <button
                      onClick={() =>
                        removeLecture(index)
                      }
                      className="mt-6 rounded-xl bg-red-50 px-4 text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 border-t pt-6">
              <button
                onClick={() => router.push("/admin")}
                className="rounded-xl border px-5 py-3"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-green-600 px-5 py-3 text-white"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}