import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-28 text-center sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 text-muted">That page doesn&apos;t exist.</p>
      <Link href="/" className="mt-8 inline-block font-medium text-accent underline underline-offset-4">
        Back home
      </Link>
    </section>
  );
}
