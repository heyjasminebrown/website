// Saves form submissions to the Supabase `leads` table (see supabase/leads.sql).

// Vercel keeps quotes pasted around a value, which would break the URL or key.
const env = (key: string) => process.env[key]?.trim().replace(/^["']|["']$/g, "") || undefined;

export type Lead = {
  source: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  details?: Record<string, unknown>;
};

/** Accepts the project URL, or the dashboard URL people often paste by mistake. */
function projectUrl(raw: string | undefined) {
  if (!raw) return undefined;
  const ref = raw.match(/supabase\.com\/dashboard\/project\/([a-z0-9]+)/i)?.[1];
  if (ref) return `https://${ref}.supabase.co`;
  return raw.replace(/\/(rest\/v1)?\/*$/, "");
}

/** The leads table's API address and auth headers, or undefined if Supabase isn't set up. */
function connection() {
  const url = projectUrl(env("SUPABASE_URL"));
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return undefined;
  return {
    endpoint: `${url}/rest/v1/leads`,
    headers: {
      apikey: key,
      // Legacy service_role keys are JWTs and also go in Authorization; new sb_secret_ keys must not.
      ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
    },
  };
}

/** Returns true if the lead was stored. Never throws, so a database problem can't break a form. */
export async function saveLead(lead: Lead): Promise<boolean> {
  const db = connection();
  if (!db) {
    if (process.env.NODE_ENV !== "production") console.log("[leads] Supabase not configured; not saved:", lead);
    return false;
  }

  try {
    const res = await fetch(db.endpoint, {
      method: "POST",
      headers: { ...db.headers, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ ...lead, details: lead.details ?? {} }),
    });
    if (!res.ok) {
      console.error("[leads] Supabase error", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[leads] Could not reach Supabase", err);
    return false;
  }
}

/**
 * A tiny read (one row id) so the free Supabase project sees activity and isn't paused after 7 idle days.
 * Run daily by the Vercel schedule in vercel.json, via /api/keep-alive.
 */
export async function pingSupabase(): Promise<boolean> {
  const db = connection();
  if (!db) return false;
  try {
    const res = await fetch(`${db.endpoint}?select=id&limit=1`, { headers: db.headers, cache: "no-store" });
    if (!res.ok) console.error("[leads] Supabase keep-alive error", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("[leads] Could not reach Supabase", err);
    return false;
  }
}
