/*
 * My cartoon portrait: black ink on a white disc, the same in both themes -
 * on the dark theme it reads as a bright badge, the way an avatar sits on a
 * dark profile.
 */
export default function Me({
  size,
  small = false,
  className = "",
  alt = "Bammidi Govinda Rao, cartoon portrait",
}: {
  /** rendered width and height, px */
  size: number;
  /** use the 160px file - for anything shown under ~80px */
  small?: boolean;
  className?: string;
  alt?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={small ? "/me-160.webp" : "/me.webp"}
      alt={alt}
      width={size}
      height={size}
      className={`block bg-white object-cover ${className}`}
    />
  );
}
