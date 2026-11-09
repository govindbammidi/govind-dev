/*
 * My cartoon portrait: black ink on a white disc, the same in both themes -
 * on the dark theme it reads as a bright badge, the way an avatar sits on a
 * dark profile.
 *
 * `alive` swaps in the animated one (me-alive.webp: four expression clips,
 * each resting on a neutral face for a few seconds before it plays). It is
 * served only when the visitor hasn't asked for reduced motion; otherwise,
 * and in browsers without <picture>, the still portrait shows.
 */
export default function Me({
  size,
  small = false,
  alive = false,
  className = "",
  alt = "Bammidi Govinda Rao, cartoon portrait",
}: {
  /** rendered width and height, px */
  size: number;
  /** use the 160px file - for anything shown under ~80px */
  small?: boolean;
  /** the animated portrait, for motion-friendly visitors */
  alive?: boolean;
  className?: string;
  alt?: string;
}) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={small ? "/me-160.webp" : "/me.webp"}
      alt={alt}
      width={size}
      height={size}
      loading={alive ? "lazy" : undefined}
      className={`block bg-white object-cover ${className}`}
    />
  );
  if (!alive) return img;
  return (
    <picture className="block">
      <source srcSet="/me-alive.webp" type="image/webp" media="(prefers-reduced-motion: no-preference)" />
      {img}
    </picture>
  );
}
