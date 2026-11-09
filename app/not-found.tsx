import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center py-[100px]">
      <div className="mx-auto w-full max-w-[700px] px-7">
        <p className="kicker rise mb-5">404</p>
        <h1 className="rise rise-1 mb-5 font-display text-display font-medium leading-[1.03] tracking-[-1.2px]">
          This page didn&apos;t <em className="italic text-accent">ship</em>.
        </h1>
        <p className="rise rise-2 mb-9 max-w-[520px] text-[20px] text-lede">
          Maybe it got rejected in review. Maybe it never existed. Either way,
          the journal is back this way.
        </p>
        <Link
          href="/"
          className="rise rise-3 inline-block glass-chip rounded-full px-[15px] py-2 font-mono text-[12.5px] text-tag no-underline hover:text-accent"
        >
          ← back home
        </Link>
      </div>
    </main>
  );
}
