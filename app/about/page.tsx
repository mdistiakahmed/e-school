// app/about/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about our education platform and mission to make learning simple and accessible.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white/70 text-gray-900">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            About Us
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Making learning simple, practical, and accessible for everyone.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>
            We are an education-focused platform built to make learning simple,
            practical, and accessible for everyone. Our mission is to help
            students and professionals gain real-world skills through
            structured, easy-to-follow online courses.
          </p>

          <p>
            Whether you're preparing for university admissions, learning a new
            language, upgrading your technical skills, or exploring creative
            hobbies, we bring everything together in one place. Each course is
            designed with clear explanations, practical examples, and a strong
            focus on results.
          </p>

          <p>
            We believe learning should not feel complicated or expensive. That’s
            why we aim to provide high-quality educational content that anyone
            can follow at their own pace, from anywhere in the world.
          </p>

          <p>
            Our goal is simple: help you learn better, grow faster, and achieve
            your personal and professional ambitions.
          </p>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold">
            Start Your Learning Journey Today
          </h2>
          <p className="text-gray-600 mt-2">
            Explore our courses and upgrade your skills.
          </p>

          <a
            href="/courses/search"
            className="inline-block mt-6 px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition"
          >
            Browse Courses
          </a>
        </div>
      </div>
    </main>
  );
}