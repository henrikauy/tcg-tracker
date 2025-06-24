export function ReleaseImage({ image }: { image?: string }) {
  return (
    <div className="w-20 h-20 bg-zinc-700 rounded flex items-center justify-center shrink-0">
      {/* Replace with <img src={image} ... /> when available */}
      <span className="text-zinc-400 text-xs">Image</span>
    </div>
  );
}