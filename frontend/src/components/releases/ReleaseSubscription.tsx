import { RiChatFollowUpFill, RiChatFollowUpLine } from "react-icons/ri";

type ReleaseSubscriptionProps = {
  isSubscribed: boolean;
  onUnsubscribe: (id: number) => void;
  onSubscribe: (id: number) => void;
  releaseId: number;
  session: any;
};

// Button component for subscribing or unsubscribing from a release
// Displays a filled icon if subscribed, and an outlined icon if not
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
      className="absolute top-2 right-2 text-green-500 hover:size-11 font-semibold"
      aria-label="Unsubscribe from release"
    >
      <RiChatFollowUpFill className="inline-block size-10" />
    </button>
  ) : (
    <button
      onClick={() => onSubscribe(releaseId)}
      className="absolute top-2 right-2 text-zinc-400 hover:size-11 font-semibold"
      aria-label="Subscribe to release"
    >
      <RiChatFollowUpLine className="inline-block size-10" />
    </button>
  );
}
