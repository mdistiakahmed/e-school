"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

type Course = any;

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [loading, setLoading] = useState(true);

  const categories = [
    "Tech & Coding",
    "Business & Marketing",
    "Academic Support",
    "Language Learning",
    "Creative Arts",
    "Career Readiness",
  ];

  async function loadCourses() {
    setLoading(true);
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((course) =>
        course.category === selectedCategory
      );
    }

    setFilteredCourses(filtered);
  }, [courses, searchQuery, selectedCategory]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    // Update URL without page reload
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    router.push(`/courses/search?${params.toString()}`);
  }

  function handleCategoryClick(category: string) {
    setSelectedCategory(category === selectedCategory ? "" : category);
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Search Courses</h1>
          <p className="text-gray-600">Find the perfect course to advance your skills</p>
        </div>

        {/* Search Form */}
        <div className="max-w-3xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              placeholder="Search by course title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category Filters */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                !selectedCategory
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || selectedCategory) && (
          <div className="max-w-7xl mx-auto mb-6 flex items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("")}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="max-w-7xl mx-auto mb-6">
              <p className="text-gray-600">
                {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"} found
              </p>
            </div>

            {/* Course Grid */}
            {filteredCourses.length === 0 ? (
              <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h2>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => {
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
                            View Course →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function CoursesSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}