"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (
      username === "admin" &&
      password === "admin"
    ) {
      localStorage.setItem(
        "isAdminAuthenticated",
        "true"
      );

      router.push("/admin");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Admin Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="mb-4 w-full rounded-xl border p-3"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-6 w-full rounded-xl border p-3"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={handleLogin}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}