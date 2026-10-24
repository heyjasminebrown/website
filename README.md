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

## Deploying (Vercel or Netlify)

1. Import this GitHub repo in Vercel or Netlify. Both detect Next.js automatically; no config needed.
2. Add the environment variables from `.env.example` in the project settings.
3. Point your domain (heyjasminebrown.com) at the project in the host's Domains settings.

Every push to the main branch then deploys automatically, and pull requests get preview URLs.
