"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUser, FaLock } from "react-icons/fa";

// Login form component for user authentication
export default function LoginForm() {
  // State for form fields and error message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Attempt to sign in with credentials
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    // Redirect or show error based on result
    if (res?.ok) {
      router.push("/myreleases");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm w-full mx-auto p-8 rounded-lg shadow-lg bg-zinc-800 text-zinc-100 border border-zinc-700"
    >
      {/* Form title */}
      <h2 className="text-3xl font-semibold mb-8 text-center text-zinc-100">
        Sign in
      </h2>
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

      {/* Email input */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-zinc-100" htmlFor="email">
          Email
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            <FaUser />
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
            autoComplete="current-password"
          />
        </div>
      </div>

      {/* Forgot password link */}

      <div className=" text-right">
        <Link
          href="/forgot-password"
          className="text-sm text-zinc-400 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="w-full py-2 mt-6 rounded border border-indigo-400 text-zinc-100 font-semibold hover:bg-indigo-400 hover:text-zinc-900 transition bg-transparent"
      >
        LOGIN
      </button>

      {/* Link to signup page */}
      <div className="mt-6 text-center text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-indigo-400 hover:underline font-semibold"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}
