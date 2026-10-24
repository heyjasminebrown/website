import Image from "next/image";
import Link from "next/link";
import { SocialIcons } from "@/components/social-icons";
import { about, gallery, homeLinks, site } from "@/content/site";

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        <h1 className="text-center text-5xl leading-tight sm:text-7xl lg:text-8xl">{site.tagline}</h1>
        <div className="mt-10 grid items-center gap-12 md:grid-cols-2">
          <Image
            src="/images/Jasmine-Home-1.jpg"
            alt={site.owner}
            width={1365}
            height={2048}
            priority
            sizes="(min-width: 768px) 448px, 100vw"
            className="mx-auto aspect-square w-full max-w-md rounded-full object-cover object-[center_62%]"
          />
          <nav className="mx-auto flex w-full max-w-xs flex-col gap-3">
            {homeLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full bg-accent px-6 py-6 text-center text-sm text-accent-foreground transition-opacity hover:opacity-90"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="bg-accent px-4 py-24 text-blush sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mx-auto max-w-md text-5xl leading-tight sm:text-7xl">{about.heading}</h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-lavender px-4 py-20 sm:px-6">
        <h2 className="text-center text-4xl sm:text-6xl">{gallery.heading}</h2>
        <div className="mx-auto mt-12 grid max-w-7xl gap-3 sm:grid-cols-3">
          {gallery.photos.map((p) => (
            <Image
              key={p.src}
              src={p.src}
              alt={p.alt}
              width={768}
              height={806}
              sizes="(min-width: 640px) 33vw, 100vw"
              className="aspect-[570/598] w-full object-cover"
            />
          ))}
        </div>
        <p className="mt-12 text-center">{gallery.connect}</p>
        <div className="mt-6">
          <SocialIcons />
        </div>
      </section>
    </>
  );
}
