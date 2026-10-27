export function Section({
  eyebrow,
  title,
  main,
  children,
}: {
  eyebrow?: string;
  title: string;
  // True when this section starts the page, so its title is the page's main heading (h1).
  main?: boolean;
  children: React.ReactNode;
}) {
  const Heading = main ? "h1" : "h2";
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {eyebrow && <p className="text-sm font-medium uppercase tracking-wider text-accent">{eyebrow}</p>}
      <Heading className="mt-2 text-3xl">{title}</Heading>
      <div className="mt-8">{children}</div>
    </section>
  );
}
