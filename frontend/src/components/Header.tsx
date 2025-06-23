"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 shadow-md border-b border-black bg-[#4484ce]">
      {/* Left: Title and navigation */}
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold tracking-tight">
          PokeCard Tracker
        </h1>
        <nav className="flex gap-4">
          <Link href="/allreleases" className="hover:underline font-medium">
            All Releases
          </Link>
          <Link href="/myreleases" className="hover:underline font-medium">
            My Subscriptions
          </Link>
        </nav>
      </div>
      {/* Right: Auth button */}
      <div>
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-white text-blue-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Log out
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="bg-white text-blue-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
}
