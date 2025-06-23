import { ReleaseCard, Release } from "@/components/ReleaseCard";

export function ReleaseList({
  releases,
  subscriptions,
  onDelete,
  onSubscribe,
}: {
  releases: Release[];
  subscriptions: number[];
  onDelete: (id: number) => void;
  onSubscribe: (id: number) => void;
}) {
  return (
    <section className="max-w-4xl mx-auto border">
      {releases.length === 0 && (
        <p className="text-zinc-400 text-center">No releases to display.</p>
      )}
      {releases
        .slice()
        .sort((a, b) => {
          if (a.status === "In Stock" && b.status !== "In Stock") return -1;
          if (b.status === "In Stock" && a.status !== "In Stock") return 1;
          return 0;
        })
        .map((release) => (
          <ReleaseCard
            key={release.id}
            release={release}
            isSubscribed={subscriptions.includes(release.id)}
            onDelete={onDelete}
            onSubscribe={onSubscribe}
          />
        ))}
    </section>
  );
}