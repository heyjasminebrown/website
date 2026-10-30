import posthog from "posthog-js";

// PostHog analytics (page views, clicks, session replay per the project's settings). Turned off until
// NEXT_PUBLIC_POSTHOG_KEY is set in Vercel. Events go through /ingest on this site (see next.config.ts)
// so ad blockers don't drop them.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key) {
  try {
    posthog.init(key, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      defaults: "2026-08-30",
    });
  } catch (err) {
    console.error("[posthog] Could not start", err);
  }
}
