# heyjasminebrown.com

Business website built with [Next.js](https://nextjs.org) 16 (App Router), TypeScript and Tailwind CSS.

## Editing content

All copy (business name, tagline, services, pricing, testimonials, bio, email, social links) is in
[`src/content/site.ts`](src/content/site.ts). Change it there and every page updates.

| Page          | File                        |
| ------------- | --------------------------- |
| Home          | `src/app/page.tsx`          |
| Services      | `src/app/services/page.tsx` |
| About         | `src/app/about/page.tsx`    |
| Contact       | `src/app/contact/`          |
| Header/Footer | `src/components/`           |
| Free guides   | `src/app/free/`, `src/app/guides/` |

Free guides and tools (lead magnets) are listed in [`src/content/lead-magnets.ts`](src/content/lead-magnets.ts),
along with all their wording. Each has a signup page at `/free/<name>`; signups are saved to Supabase as
`Lead magnet: <title>` and emailed a link to the printable guide at `/guides/<name>` (the quiz emails the score instead).

Brand colours (plum, blush, lavender) are CSS variables at the top of `src/app/globals.css`. Fonts are Marcellus (headings) and PT Serif (body), set in `src/app/layout.tsx`. Photos live in `public/images/`.

## Local development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Contact form

The form posts to a Server Action (`src/app/contact/actions.ts`) that emails enquiries using
[Resend](https://resend.com). Copy `.env.example` to `.env.local` and set `RESEND_API_KEY`.
Without a key, messages are logged to the console in development, and in production the form
asks visitors to email you directly, so nothing is silently lost.

## Wealthy Notes blog

Posts are Markdown files in [`content/blog/`](content/blog/). Copy
[`_template.md`](content/blog/_template.md), rename it (the file name becomes the URL, e.g.
`first-flip.md` → `/blog/first-flip`), fill in the header and write the post. Posts with
`draft: true` are hidden on the live site. Put post photos in `public/images/blog/`.
An RSS feed is at `/blog/feed.xml`.

## Leads database (Supabase)

Every form submission (contact, loan, investor, newsletter, referral, calculator) is saved to a
`leads` table in Supabase as well as emailed. To set it up:

1. In Supabase, open **SQL Editor → New query**, paste [`supabase/leads.sql`](supabase/leads.sql) and click **Run**.
2. In Vercel, add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (Supabase **Project Settings → API**) and redeploy.

View leads in Supabase under **Table Editor → leads**; export with the **Export → CSV** button.
A submission counts as received if it reaches either Supabase or your inbox.

## Deploying (Vercel or Netlify)

1. Import this GitHub repo in Vercel or Netlify. Both detect Next.js automatically; no config needed.
2. Add the environment variables from `.env.example` in the project settings.
3. Point your domain (heyjasminebrown.com) at the project in the host's Domains settings.

Every push to the main branch then deploys automatically, and pull requests get preview URLs.
