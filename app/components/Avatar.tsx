type AvatarProps = {
  src?: string | null;
  name: string;
  size?: number;
};

export function Avatar({ src, name, size = 40 }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500"
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
