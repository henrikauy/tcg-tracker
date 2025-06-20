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
  const [subscriptions, setSubscriptions] = useState<number[]>([]);

  useEffect(() => {
    if (!session?.accessToken) return;
    fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/me/subscriptions`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSubscriptions(data.map((release: any) => release.id));
      });
  }, [session]);

  useEffect(() => {
    // Fetch all releases from the API when the component mounts
    fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/releases`)
      .then((response) => response.json())
      .then((data) => {
        // Map the API response to the format used in the frontend
        const mappedReleases = data.map((release: any) => ({
          id: release.id,
          name: release.name,
          link: release.url,
          status: release.status,
          image: release.image || "", // Ensure image is always a string
        }));
        // Update the state with the fetched releases
        setReleases(mappedReleases);
      });
  }, []);

  const handleDelete = (id: number) => {
    if (!session?.accessToken) return;
    fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/me/subscriptions/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ release_id: id }),
    })
      .then(() => {
        setSubscriptions((prev) => prev.filter((rid) => rid !== id));
      })
      .catch((err) => {
        alert("Failed to unsubscribe." + err.message);
      });
  };

  const handleSubscribe = (id: number) => {
    if (!session?.accessToken) return;
    fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/me/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ release_id: id }),
    })
      .then((res) => {
        if (res.ok) {
          setSubscriptions((prev) => [...prev, id]);
        } else {
          alert("Failed to subscribe.");
        }
      })
      .catch((err) => {
        alert("Error subscribing: " + err.message);
      });
  };

  const handleRefresh = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/fetch/bigw`);
    // After refreshing, re-fetch the releases
    fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/releases`)
      .then((response) => response.json())
      .then((data) => {
        // Map the API response to the format used in the frontend
        const mappedReleases = data.map((release: any) => ({
          id: release.id,
          name: release.name,
          link: release.url,
          status: release.status,
        }));
        // Update the state with the fetched releases
        setReleases(mappedReleases);
      });
  };

  return (
    <main className="min-h-screen bg-theme p-8">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-theme">All Releases</h1>
      </header>
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-theme">All Releases</h1>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-theme-accent text-white rounded hover:bg-theme-accent-dark transition"
        >
          Refresh Releases
        </button>
      </header>
      <section className="max-w-4xl mx-auto border ">
        {releases
        .slice()
        .sort((a, b) => {
          if (a.status === "In Stock" && b.status !== "In Stock") return -1;
          if (b.status === "In Stock" && a.status !== "In Stock") return 1;
          return 0;
        })
        .map((release: any) => (
          <ReleaseCard
            key={release.id}
            release={release}
            isSubscribed={subscriptions.includes(release.id)}
            onDelete={handleDelete}
            onSubscribe={handleSubscribe}
          />
        ))}
      </section>
    </main>
  );
}
