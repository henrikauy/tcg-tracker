type ReleaseMetaProps = {
  price?: string;
  source?: string;
  status: string;
};

export function ReleaseMeta({ price, source, status }: ReleaseMetaProps) {
  const badgeClass =
    status === "In Stock"
      ? "bg-green-200 text-green-800"
      : "bg-yellow-200 text-yellow-800";
  return (
    <div className="flex gap-4 items-center mb-1">
      <span className="text-xs text-zinc-300">
        Price: <span className="font-semibold">{price ?? "—"}</span>
      </span>
      <span className="text-xs text-zinc-400">
        Source: <span className="font-semibold">{source ?? "—"}</span>
      </span>
      <span
        className={`max-w-fit inline-block px-2 py-0.5 mt-0.5 text-xs font-medium rounded-full ${badgeClass}`}
      >
        {status}
      </span>
    </div>
  );
}