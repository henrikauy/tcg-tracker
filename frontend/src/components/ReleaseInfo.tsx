type ReleaseInfoProps = {
  name: string;
  link: string;
};

export function ReleaseInfo({ name, link }: ReleaseInfoProps) {
  return (
    <>
      <h2 className="text-s font-semibold text-zinc-100 break-words">
        {name}
      </h2>
      <p className="text-xs mb-0.5">
        <a
          href={link}
          className="text-zinc-400 hover:underline break-words block"
          title={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link}
        </a>
      </p>
    </>
  );
}