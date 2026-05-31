"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut, signIn } from "next-auth/react";

const Topbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<
    "courses" | "resources" | null
  >(null);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const isAnyActive = (paths: string[]) => paths.some((p) => pathname === p);

  const navItems = [
    {
      id: "courses" as const,
      name: "Courses",
      children: [
        {
          name: "All Courses",
          href: "/courses",
        },
        {
          name: "My Learning",
          href: "/my-learning",
        },
      ],
    },
    {
      id: "resources" as const,
      name: "Resources",
      children: [
        {
          name: "Blog",
          href: "/blog",
        },
        {
          name: "Documentation",
          href: "/docs",
        },
      ],
    },
    {
      id: "about" as const,
      name: "About",
      href: "/about",
    },
    {
      id: "contact" as const,
      name: "Contact",
      href: "/contact",
    },
  ];

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                {/* <Image
                  src="/logo.png"
                  alt="EduTech Logo"
                  fill
                  className="object-contain"
                /> */}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-blue-700 leading-tight">
                  BaseCamp
                </span>
                <span className="text-xs text-gray-500">.bd</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              if (!item.children) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium ${
                      isActive(item.href)
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              }

              const childHrefs = item.children.map((c) => c.href);
              const active = isAnyActive(childHrefs);

              return (
                <div key={item.id} className="relative group">
                  <button
                    type="button"
                    className={`px-3 py-2 text-sm font-medium inline-flex items-center gap-1 ${
                      active
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                    aria-haspopup="menu"
                    aria-expanded="false"
                  >
                    {item.name}
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <div className="absolute left-0 top-full z-50 pt-2 hidden group-hover:block group-focus-within:block">
                    <div className="min-w-64 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-3 text-sm ${
                            isActive(child.href)
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Login/Logout Button */}
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              if (!item.children) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-md ${
                      isActive(item.href)
                        ? "text-blue-700 bg-blue-50"
                        : "text-gray-800 bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              }

              const childHrefs = item.children.map((c) => c.href);
              const active = isAnyActive(childHrefs);
              const expanded = openMobileSection === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-md overflow-hidden border border-gray-100"
                >
                  <button
                    type="button"
                    className={`w-full flex items-center justify-between px-3 py-2 text-base font-medium ${
                      active
                        ? "text-blue-700 bg-blue-50"
                        : "text-gray-800 bg-white hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setOpenMobileSection((prev) =>
                        prev === item.id ? null : item.id,
                      )
                    }
                    aria-expanded={expanded}
                  >
                    <span>{item.name}</span>
                    <svg
                      className={`h-5 w-5 transition-transform ${
                        expanded ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {expanded && (
                    <div className="bg-white">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-5 py-2 text-sm ${
                            isActive(child.href)
                              ? "text-blue-700 bg-blue-50"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setOpenMobileSection(null);
                          }}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div>
              {/* Login/Logout Button */}
              <AuthButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};


function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-10 w-20 animate-pulse bg-gray-200 rounded-lg"></div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user?.name || "User"}
            className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
          />
        )}
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Login
    </button>
  );
}

export default Topbar;