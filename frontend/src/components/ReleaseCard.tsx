import React from "react";
import { useSession } from "next-auth/react";

// TypeScript type describing the shape of a release object
export type Release = {
  id: number;
  name: string;
  link: string;
  status: string;
};

type ReleaseCardProps = {
  release: Release;
  onDelete: (id: number) => void;
  isSubscribed: boolean;
  onSubscribe: (id: number) => void;
};

// ReleaseCard component displays a single release card
export function ReleaseCard({
  release,
  onDelete,
  isSubscribed,
  onSubscribe,
}: ReleaseCardProps) {
  // Determine badge style based on release status
  const badgeClass =
    release.status === "released" ? "badge-released" : "badge-preorder";
  const { data: session, status } = useSession();

  return (
    <div
      className={
        `relative border border-black p-2 flex flex-col transition-shadow hover:bg-theme-accent-dark mb-0.1` +
        (isSubscribed ? " bg-card-bg-subscribed" : " bg-card-bg")
      }
    >
      {/* Subscribe button*/}
      {session &&
        (isSubscribed ? (
          <button
            onClick={() => onDelete(release.id)}
            className="absolute top-2 right-2 text-theme hover:text-red-500"
            aria-label="Delete release"
          >
            Unsubscribe
          </button>
        ) : (
          <button
            onClick={() => onSubscribe(release.id)}
            className="absolute top-2 right-2 text-theme hover:text-red-500"
            aria-label="Subscribe to release"
          >
            Subscribe
          </button>
        ))}
      {/* Release name */}
      <h2 className="text-xl font-semibold text-theme">{release.name}</h2>

      {/* Release link*/}
      <p className="text-sm text-black">
        {" "}
        <a href={release.link} className="text-theme hover:underline">
          {release.link.length > 40
            ? release.link.slice(0, 35) + "..."
            : release.link}
        </a>
      </p>

      {/* Status badge */}
      <span
        className={`max-w-fit inline-block px-2 py-1 text-xs font-medium rounded-full ${badgeClass}`}
      >
        {release.status}
      </span>
    </div>
  );
}
