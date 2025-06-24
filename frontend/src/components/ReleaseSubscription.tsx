import { RiChatFollowUpFill, RiChatFollowUpLine } from "react-icons/ri";

type ReleaseSubscriptionProps = {
  isSubscribed: boolean;
  onUnsubscribe: (id: number) => void;
  onSubscribe: (id: number) => void;
  releaseId: number;
  session: any;
};

export function ReleaseSubscription({
  isSubscribed,
  onUnsubscribe,
  onSubscribe,
  releaseId,
  session,
}: ReleaseSubscriptionProps) {
  if (!session) return null;
  return isSubscribed ? (
    <button
      onClick={() => onUnsubscribe(releaseId)}
      className="absolute top-2 right-2 text-zinc-600 hover:text-red-500 font-semibold"
      aria-label="Unsubscribe from release"
    >
      <RiChatFollowUpLine className="inline-block size-10" />
    </button>
  ) : (
    <button
      onClick={() => onSubscribe(releaseId)}
      className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 font-semibold"
      aria-label="Subscribe to release"
    >
      <RiChatFollowUpFill className="inline-block size-10" />
    </button>
  );
}