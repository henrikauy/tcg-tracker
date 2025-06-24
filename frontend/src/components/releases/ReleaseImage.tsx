type ReleaseImageProps = {
  image?: string;
};

// Component to display an image for a release
export function ReleaseImage({ image }: { image?: string }) {
  return (
    <div className="w-20 h-20 bg-zinc-700 rounded flex items-center justify-center shrink-0">
      <span className="text-zinc-400 text-xs">
        {image ? (
          <img src={image} alt="Release" className="w-full h-full object-cover" />
        ) : (
          "No Image"
        )}
      </span>
    </div>
  );
}