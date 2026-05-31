"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useLoginModal } from "@/context/LoginModalContext";

type AuthButtonProps = {
  className?: string;
};

export default function AuthButton({ className }: AuthButtonProps) {
  const { data: session, status } = useSession();
  const { openLoginModal } = useLoginModal();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
    );
  }

  if (session) {
    return (
      <div className={`relative ${className ?? ""}`} ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="focus:outline-none"
        >
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user?.name || "User"}
              className="h-10 w-10 rounded-full border-2 border-gray-200 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              {session.user?.name?.charAt(0) || "U"}
            </div>
          )}
        </button>

        {open && (
          <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border bg-white shadow-lg">
            <Link
              href="/my-learning"
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              My Learning
            </Link>

            <Link
              href="/profile"
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openLoginModal()}
      className={
        className ??
        "flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      }
    >
      Login
    </button>
  );
}
