import { useSession } from "next-auth/react";
import { ReleaseImage } from "./ReleaseImage";
import { ReleaseSubscription } from "./ReleaseSubscription";
import { ReleaseInfo } from "./ReleaseInfo";
import { ReleaseMeta } from "./ReleaseMeta";

export type Release = {
  id: number;
  name: string;
  link: string;
  status: string;
  image?: string;
  price?: string;
  source?: string;
};

type ReleaseCardProps = {
  release: Release;
  onUnsubscribe: (id: number) => void;
  isSubscribed: boolean;
  onSubscribe: (id: number) => void;
};

export function ReleaseCard({
  release,
  onUnsubscribe,
  isSubscribed,
  onSubscribe,
}: ReleaseCardProps) {
  const { data: session } = useSession();

  return (
    <div
      className={
        `bg-zinc-800 border-zinc-600 border-1 p-1 flex flex-col shadow transition-shadow hover:bg-zinc-700` +
        (isSubscribed ? " bg-blue-50" : " bg-white")
      }
    >
      <div className="flex items-start gap-4">
        <ReleaseImage image={release.image} />
        <div className="flex-1 relative">
          <ReleaseSubscription
            isSubscribed={isSubscribed}
            onUnsubscribe={onUnsubscribe}
            onSubscribe={onSubscribe}
            releaseId={release.id}
            session={session}
          />
          <ReleaseInfo name={release.name} link={release.link} />
          <ReleaseMeta
            price={release.price}
            source={release.source}
            status={release.status}
          />
        </div>
      </div>
    </div>
  );
}
