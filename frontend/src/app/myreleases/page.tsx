'use client';
import React, { useEffect, useState } from 'react';
import { ReleaseCard, Release } from '@/components/ReleaseCard';
import { InputCard, NewRelease } from '@/components/InputCard';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useDeleteRelease } from "@/hooks/useDeleteRelease";

export default function MyReleasesPage() {
  // Get the current session (user authentication info)
  const { data: session } = useSession();
  // State to hold the list of releases the user is subscribed to
  const [releases, setReleases] = useState<Release[]>([]);
  const router = useRouter();

  // Redirect to home page if the user is not logged in
  useEffect(() => {
    if (session === null) {
      router.push("/");
    }
  }, [session, router]);

  // Fetch only the current user's subscribed releases when session changes
  useEffect(() => {
    if (!session?.accessToken) return;

    fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/me/subscriptions`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        // Map the API response to the Release type used in the frontend
        const mappedReleases = data.map((release: any) => ({
          id: release.id,
          name: release.name,
          link: release.url,
          status: release.status,
        }));
        setReleases(mappedReleases);
      })
      .catch(() => setReleases([]));
  }, [session]);

  // Handle deleting a release subscription for the current user
  const handleDelete = useDeleteRelease(session?.accessToken, setReleases);

  // Show error message if session is not available or access token is missing
  if (!session?.accessToken) {
    return <div className="text-center mt-12">Unable to load releases...</div>;
  }

  // Render the list of releases and the input form for adding new releases
  return (
    <main className="min-h-screen bg-theme p-8">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-theme">Tracked Releases</h1>
      </header>
      <section className="max-w-4xl mx-auto border">
        {/* Render a card for each subscribed release */}
        {releases.map(release => (
          <ReleaseCard key={release.id} release={release} onDelete={handleDelete} />
        ))}
        {/* Show a message if there are no releases */}
        {releases.length === 0 && (
          <p className="text-theme text-center col-span-full">No releases to display.</p>
        )}
      </section>
      <section className="max-w-4xl mx-auto mt-12">
        {/* Input form to add and subscribe to a new release */}
        <InputCard
          accessToken={session.accessToken}
          onAdd={(newRelease: NewRelease) => {
            setReleases(prev => [
              ...prev,
              { ...newRelease, id: Date.now() }
            ]);
          }}
        />
      </section>
    </main>
  );
}
