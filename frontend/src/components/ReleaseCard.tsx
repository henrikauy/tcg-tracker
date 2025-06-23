import React from "react";
import { useSession } from "next-auth/react";

// TypeScript type describing the shape of a release object
export type Release = {
  id: number;
  name: string;
  link: string;
  status: string;
  image?: string;
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
    release.status === "In Stock"
      ? "bg-green-200 text-green-800"
      : "bg-yellow-200 text-yellow-800";
  const { data: session } = useSession();

  return (
    <div
      className={
        `relative border border-black p-4 flex flex-col rounded-lg shadow transition-shadow hover:bg-blue-100 mb-2` +
        (isSubscribed ? " bg-blue-50" : " bg-white")
      }
    >
      {/* Subscribe/Unsubscribe button */}
      {session &&
        (isSubscribed ? (
          <button
            onClick={() => onDelete(release.id)}
            className="absolute top-2 right-2 text-blue-700 hover:text-red-500 font-semibold"
            aria-label="Unsubscribe from release"
          >
            Unsubscribe
          </button>
        ) : (
          <button
            onClick={() => onSubscribe(release.id)}
            className="absolute top-2 right-2 text-blue-700 hover:text-red-500 font-semibold"
            aria-label="Subscribe to release"
          >
            Subscribe
          </button>
        ))}
      {/* Release name */}
      <h2 className="text-xl font-semibold text-gray-800">{release.name}</h2>

      {/* Release link*/}
      <p className="text-sm text-gray-600">
        {" "}
        <a href={release.link} className="text-blue-600 hover:underline">
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
