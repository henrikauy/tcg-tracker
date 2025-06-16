import { useCallback } from "react";

export function useDeleteRelease(accessToken: string | undefined, setReleases: React.Dispatch<React.SetStateAction<any[]>>) {
  // useCallback to avoid unnecessary re-renders
  const handleDelete = useCallback((id: number) => {
    if (!accessToken) return;
    fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/releases/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(() => {
        setReleases(prev => prev.filter(r => r.id !== id));
      })
      .catch((err) => {
        alert("Failed to delete release." + err.message);
      });
  }, [accessToken, setReleases]);

  return handleDelete;
}