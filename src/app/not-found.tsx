import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[70vh] place-items-center pt-24 text-center">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">404</p>
        <h1 className="mt-3 font-serif text-5xl italic">Nothing shipped here yet.</h1>
        <Link href="/" className="mt-8 inline-flex h-11 items-center rounded-full bg-fg px-5 text-sm font-medium text-bg">
          Back home
        </Link>
      </div>
    </div>
  );
}
