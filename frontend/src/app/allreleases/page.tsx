"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ReleaseCard, Release } from "@/components/ReleaseCard";
import { useDeleteRelease } from "@/hooks/useDeleteRelease";

export default function AllReleasesPage() {
  // Get the current session (user authentication info)
  const { data: session } = useSession();
  // State to hold the list of all releases
  const [releases, setReleases] = useState<Release[]>([]);

  useEffect(() => {
    // Fetch all releases from the API when the component mounts
    fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/releases`)
      .then((response) => response.json())
      .then((data) => {
        // Map the API response to the format used in the frontend
        const mappedReleases = data.map((release : any) => ({
          id: release.id,
          name: release.name,
          link: release.url,
          status: release.status,
        }));
        // Update the state with the fetched releases
        setReleases(mappedReleases);
      });
  }, []);

  // Handle deleting a release subscription for the current user
  const handleDelete = useDeleteRelease(session?.accessToken, setReleases);

  return (
    <main className="min-h-screen bg-theme p-8">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-theme">All Releases</h1>
      </header>
      <section className="max-w-4xl mx-auto border ">
        {releases.map((release : any) => (
          <ReleaseCard key={release.id} release={release} onDelete={handleDelete} />
        ))}
      </section>
    </main>
  );
}
