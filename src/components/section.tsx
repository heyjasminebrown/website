export function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {eyebrow && <p className="text-sm font-medium uppercase tracking-wider text-accent">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}
