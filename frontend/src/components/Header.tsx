"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 shadow-md border-b border-indigo-400 bg-zinc-800">
      {/* Left: Title and navigation */}
      <div className="flex items-center gap-8">
        <h1 className="text-2xl tracking-tight text-zinc-100">
          PokeCard Tracker
        </h1>
        <nav className="flex gap-4">
          <Link href="/allreleases" className="hover:text-zinc-100 font-medium text-zinc-400">
            All Releases
          </Link>
          <Link href="/myreleases" className="hover:text-zinc-100 font-medium text-zinc-400">
            My Subscriptions
          </Link>
        </nav>
      </div>
      {/* Right: Auth button */}
      <div>
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-zinc-800 text-zinc-400 font-semibold px-4 py-2 rounded hover:bg-indigo-400 transition"
          >
            Log out
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="bg-zinc-800 text-zinc-400 font-semibold px-4 py-2 rounded hover:bg-indigo-400 transition"
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
}
