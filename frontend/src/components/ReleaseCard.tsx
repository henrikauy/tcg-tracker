import React from "react";

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
};

// ReleaseCard component displays a single release card with delete functionality
export function ReleaseCard({ release, onDelete }: ReleaseCardProps) {
  // Determine badge style based on release status
  const badgeClass =
    release.status === "released" ? "badge-released" : "badge-preorder";

  return (
    <div className="relative bg-card-bg border border-black p-2 flex flex-col transition-shadow hover:bg-theme-accent-dark mb-0.1">
      {/* Delete button (top-right corner) */}
      <button
        onClick={() => onDelete(release.id)}
        className="absolute top-2 right-2 text-theme hover:text-red-500"
        aria-label="Delete release"
      >
        ×
      </button>

      {/* Release name */}
      <h2 className="text-xl font-semibold text-theme">{release.name}</h2>

      {/* Release link (truncated if too long) */}
      <p className="text-sm text-muted">
        Link:{" "}
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
