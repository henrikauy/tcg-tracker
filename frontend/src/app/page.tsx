'use client';
import React, { useEffect, useState } from 'react';
import { ReleaseCard, Release } from '@/components/ReleaseCard';
import { InputCard, NewRelease } from '@/components/InputCard';


// Mock data
const initialReleases: Release[] = [
  { id: 1, name: 'Scarlet & Violet', link: 'https://www.bigw.com.au/product/pokemon-tcg-scarlet-violet-destined-rivals-booster-display/p/6023781', status: 'Pre-Order' },
];

export default function Home() {
  const [releases, setReleases] = useState<Release[]>(initialReleases);

  const handleDelete = (id: number) => {
    setReleases(prev => prev.filter(r => r.id !== id));
  };

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
        <InputCard onAdd={(newRelease: NewRelease) => {
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
