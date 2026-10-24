import { ContactForm } from "@/app/contact/contact-form";
import { newsletter } from "@/content/site";

/** Newsletter signup shown under the blog and every post. */
export function Subscribe() {
  return (
    <section className="bg-lavender px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-xl">
        <h2 className="text-center text-4xl">Get {newsletter.name} in your inbox</h2>
        <p className="mb-8 mt-3 text-center text-lg">{newsletter.intro}</p>
        <ContactForm topic="Newsletter" signup submitLabel="Subscribe" />
      </div>
    </section>
  );
}
