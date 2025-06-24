"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

// Signup form component for user registration
export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Send signup request to backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, mobile, password }),
    });

    // Handle response
    if (res.ok) {
      setSuccess("Signup successful! You can now log in.");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      const data = await res.json();
      setError(data.detail || "Signup failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm w-full mx-auto p-8 rounded-lg shadow-lg bg-zinc-800 text-zinc-100 border border-zinc-700"
    >
      {/* Form title */}
      <h2 className="text-3xl font-semibold mb-8 text-center text-zinc-100">
        Sign up
      </h2>
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
      {success && (
        <div className="mb-4 text-green-500 text-center">{success}</div>
      )}

      {/* Email input */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-zinc-100" htmlFor="email">
          Email
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            <FaEnvelope />
          </span>
          <input
            id="email"
            type="email"
            className="w-full pl-10 pr-3 py-2 rounded bg-transparent border border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password input */}
      <div className="mb-2">
        <label
          className="block mb-2 font-medium text-zinc-100"
          htmlFor="password"
        >
          Password
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            <FaLock />
          </span>
          <input
            id="password"
            type="password"
            className="w-full pl-10 pr-3 py-2 rounded bg-transparent border border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-400"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="w-full py-2 mt-6 rounded border border-indigo-400 text-zinc-100 font-semibold hover:bg-indigo-400 hover:text-zinc-900 transition bg-transparent"
      >
        SIGN UP
      </button>

      {/* Link to login page */}
      <div className="mt-6 text-center text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-indigo-400 hover:underline font-semibold"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}
