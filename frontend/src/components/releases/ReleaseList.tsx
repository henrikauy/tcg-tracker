import { ReleaseCard, Release } from "@/components/releases/ReleaseCard";

type ReleaseListProps = {
  releases: Release[];
  subscriptions: number[];
  onUnsubscribe: (id: number) => void;
  onSubscribe: (id: number) => void;
};

// Component to display a list of releases
export function ReleaseList({
  releases,
  subscriptions,
  onUnsubscribe,
  onSubscribe,
}: ReleaseListProps) {
  return (
    <section className="max-w-7xl mx-auto">
      {releases.length === 0 && (
        <p className="text-zinc-400 text-center">No releases to display.</p>
      )}
      {releases.map((release) => (
        <ReleaseCard
          key={release.id}
          release={release}
          isSubscribed={subscriptions.includes(release.id)}
          onUnsubscribe={onUnsubscribe}
          onSubscribe={onSubscribe}
        />
      ))}
    </section>
  );
}
