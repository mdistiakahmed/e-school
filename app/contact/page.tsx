// app/contact/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with us for support, feedback, or inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white/60 text-gray-900">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Contact Us
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            We’d love to hear from you. Send us a message anytime.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Get in Touch</h2>
              <p className="text-gray-600 mt-2">
                Have questions about courses, pricing, or partnerships? Our
                team is here to help you.
              </p>
            </div>

            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-medium">Email:</span> support@example.com
              </p>
              <p>
                <span className="font-medium">Phone:</span> +880 1XXX-XXXXXX
              </p>
              <p>
                <span className="font-medium">Response Time:</span> Within 24–48 hours
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl">
              <p className="text-gray-600 text-sm">
                We typically respond to all messages within 1–2 business days.
                For urgent issues, please mention it in your subject line.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <form className="space-y-5 bg-gray-50 p-6 rounded-2xl shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="mt-2 w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="mt-2 w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Write your message..."
                className="mt-2 w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}