"use client";
import React, { useEffect, useState } from "react";
import { ReleaseCard, Release } from "@/components/releases/ReleaseCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReleaseList } from "@/components/releases/ReleaseList";
import {
  handleSubscribe,
  handleUnsubscribe,
} from "@/handlers/subscriptionHandlers";

// Page for displaying and managing the user's tracked (subscribed) releases
export default function MyReleasesPage() {
  const { data: session } = useSession(); // Get current user session
  const [releases, setReleases] = useState<Release[]>([]); // State for release data
  const [subscriptions, setSubscriptions] = useState<number[]>([]); // State for subscribed release IDs
  const router = useRouter();

  // Redirect to home if user is not logged in
  useEffect(() => {
    if (session === null) {
      router.push("/");
    }
  }, [session, router]);

  // Fetch user's subscriptions from backend when session changes
  useEffect(() => {
    if (!session?.accessToken) return;

    fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/me/subscriptions`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Map backend data to Release objects
        const mappedReleases = data.map((release: any) => ({
          id: release.id,
          name: release.name,
          link: release.url,
          status: release.status,
          image: release.image,
          price: release.price,
          source: release.source,
        }));
        setReleases(mappedReleases);
        // Store IDs of subscribed releases
        setSubscriptions(data.map((release: any) => release.id));
      })
      .catch(() => setReleases([]));
  }, [session]);

  // Show message if user is not authenticated
  if (!session?.accessToken) {
    return <div className="text-center mt-12">Unable to load releases...</div>;
  }

  return (
    <main className="min-h-screen bg-zinc-900 p-8">
      {/* Page header */}
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-zinc-100">Tracked Releases</h1>
      </header>
      {/* List of user's tracked releases */}
      <ReleaseList
        releases={releases}
        subscriptions={subscriptions}
        onSubscribe={(id) => handleSubscribe(id, session, setSubscriptions)}
        onUnsubscribe={(id) => handleUnsubscribe(id, session, setSubscriptions)}
      />
      {/* Show message if no releases are tracked */}
      {releases.length === 0 && (
        <p className="text-zinc-100 text-center col-span-full">
          No releases to display.
        </p>
      )}
    </main>
  );
}
