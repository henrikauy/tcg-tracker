/**
 * Utility functions for subscribing and unsubscribing to releases.
 * These can be reused in any component.
 */

// Subscribe the user to a release
export async function handleSubscribe(
  id: number,
  session: any,
  setSubscriptions: React.Dispatch<React.SetStateAction<number[]>>
) {
  if (!session?.accessToken) return;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/me/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ release_id: id }),
    });
    if (res.ok) {
      setSubscriptions((prev) => [...prev, id]);
    } else {
      alert("Failed to subscribe.");
    }
  } catch (err: any) {
    alert("Error subscribing: " + err.message);
  }
}

// Unsubscribe the user from a release
export async function handleUnsubscribe(
  id: number,
  session: any,
  setSubscriptions: React.Dispatch<React.SetStateAction<number[]>>
) {
  if (!session?.accessToken) return;
  try {
    await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/me/subscriptions/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ release_id: id }),
    });
    setSubscriptions((prev) => prev.filter((rid) => rid !== id));
  } catch (err: any) {
    alert("Failed to unsubscribe." + err.message);
  }
}