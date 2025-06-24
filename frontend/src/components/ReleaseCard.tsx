import React from "react";
import { useSession } from "next-auth/react";
import { RiChatFollowUpFill, RiChatFollowUpLine } from "react-icons/ri";

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
        `bg-zinc-800 border-zinc-900 border-1 p-1 flex flex-col shadow transition-shadow hover:bg-zinc-700` +
        (isSubscribed ? " bg-blue-50" : " bg-white")
      }
    >
      {/* Subscribe/Unsubscribe button */}
      {session &&
        (isSubscribed ? (
          <button
            onClick={() => onDelete(release.id)}
            className="absolute top-2 right-2 text-zinc-600 hover:text-red-500 font-semibold"
            aria-label="Unsubscribe from release"
          >
            <RiChatFollowUpLine className="inline-block size-10" />
          </button>
        ) : (
          <button
            onClick={() => onSubscribe(release.id)}
            className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 font-semibold"
            aria-label="Subscribe to release"
          >
            <RiChatFollowUpFill className="inline-block size-10" />
          </button>
        ))}
      {/* Release name */}
      <h2 className="text-s font-semibold text-zinc-100">
        {release.name.length > 50
        ? release.name.slice(0, 47) + "..."
        : release.name}
      </h2>

      {/* Release link*/}
      <p className="text-xs mb-0.5">
        {" "}
        <a href={release.link} className="text-zinc-400 hover:underline">
          {release.link.length > 40
            ? release.link.slice(0, 35) + "..."
            : release.link}
        </a>
      </p>

      {/* Status badge */}
      <span
        className={`max-w-fit inline-block px-2 py-0.5 mt-0.5 text-xs font-medium rounded-full ${badgeClass}`}
      >
        {release.status}
      </span>
    </div>
  );
}
