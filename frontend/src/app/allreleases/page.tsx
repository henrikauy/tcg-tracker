"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ReleaseList } from "@/components/releases/ReleaseList";
import { Release } from "@/components/releases/ReleaseCard";
import {
  handleSubscribe,
  handleUnsubscribe,
} from "@/handlers/subscriptionHandlers";
import { SortByStock } from "@/components/releases/sorting/SortByStock";

// Page to display all releases and manage subscriptions
export default function AllReleasesPage() {
  const { data: session } = useSession();
  const [releases, setReleases] = useState<Release[]>([]);
  const [subscriptions, setSubscriptions] = useState<number[]>([]);
  const [sortByStock, setSortByStock] = useState<"none" | "in" | "out">("none");

  // Fetch user subscriptions on session change
  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!session?.accessToken) return; // Ensure user is logged in
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_FASTAPI_URL}/me/subscriptions`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        const data = await response.json();
        setSubscriptions(data.map((release: any) => release.id));
      } catch (error) {
        setSubscriptions([]);
      }
    };
    fetchSubscriptions();
  }, [session]);

  // Fetch all releases
  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_FASTAPI_URL}/releases`
        );
        const data = await response.json();
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
      } catch (error) {
        setReleases([]);
      }
    };
    fetchReleases();
  }, []);

  // Refresh releases from backend and reload page
  const handleRefresh = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/fetch/bigw`);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FASTAPI_URL}/releases`
      );
      const data = await response.json();
      const mappedReleases = data.map((release: any) => ({
        id: release.id,
        name: release.name,
        link: release.url,
        status: release.status,
      }));
      setReleases(mappedReleases);
      window.location.reload();
    } catch (error) {
      console.error("Failed to refresh releases:", error);
      alert("Failed to refresh releases. Please try again later.");
    }
  };

  // Sort releases by stock status
  let sortedReleases = releases.map((release) => ({
    ...release,
    isSubscribed: subscriptions.includes(release.id),
    inStock: release.status?.toLowerCase().includes("in stock"),
  }));
  if (sortByStock === "in") {
    sortedReleases = sortedReleases.sort(
      (a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0)
    );
  } else if (sortByStock === "out") {
    sortedReleases = sortedReleases.sort(
      (a, b) => (a.inStock ? 1 : 0) - (b.inStock ? 1 : 0)
    );
  }

  return (
    <main className="min-h-screen bg-zinc-900 p-8">
      {/* Page header and refresh button */}
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-zinc-100">All Releases</h1>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-indigo-400 text-white rounded hover:bg-indigo-500 transition"
        >
          Refresh Releases
        </button>
      </header>
      <SortByStock sortByStock={sortByStock} setSortByStock={setSortByStock} />
      {/* List of releases */}
      <ReleaseList
        releases={sortedReleases.sort((a, b) => {
          // Subscribed first
          if (a.isSubscribed && !b.isSubscribed) return -1;
          if (!a.isSubscribed && b.isSubscribed) return 1;
          return 0;
        })}
        subscriptions={subscriptions}
        onSubscribe={(id) => handleSubscribe(id, session, setSubscriptions)}
        onUnsubscribe={(id) => handleUnsubscribe(id, session, setSubscriptions)}
      />
    </main>
  );
}
