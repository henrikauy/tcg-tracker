'use client';
import React, { useEffect, useState } from 'react';
import { ReleaseCard, Release } from '@/components/ReleaseCard';
import { InputCard, NewRelease } from '@/components/InputCard';
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [releases, setReleases] = useState<Release[]>([]);

  // Fetch only the current user's subscriptions
  useEffect(() => {
    if (!session?.accessToken) return;

    fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/me/subscriptions`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then(response => response.json())
      .then(data => {
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

  const handleDelete = (id: number) => {
    if (!session?.accessToken) return;
    fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/releases/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then(() => {
        setReleases(prev => prev.filter(r => r.id !== id));
      })
      .catch((err) => {
        alert("Failed to delete release." + err.message);
      });
  };

  if (!session?.accessToken) {
    return <div className="text-center mt-12">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-theme p-8">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-theme">Pokemon TCG Releases</h1>
      </header>
      <section className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {releases.map(release => (
          <ReleaseCard key={release.id} release={release} onDelete={handleDelete} />
        ))}
        {releases.length === 0 && (
          <p className="text-theme text-center col-span-full">No releases to display.</p>
        )}
      </section>
      <section className="max-w-4xl mx-auto mt-12">
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
