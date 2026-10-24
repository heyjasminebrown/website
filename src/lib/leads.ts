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

/** Returns true if the lead was stored. Never throws, so a database problem can't break a form. */
export async function saveLead(lead: Lead): Promise<boolean> {
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    if (process.env.NODE_ENV !== "production") console.log("[leads] Supabase not configured; not saved:", lead);
    return false;
  }

  try {
    const res = await fetch(`${url.replace(/\/+$/, "")}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: key,
        // Legacy service_role keys are JWTs and also go in Authorization; new sb_secret_ keys must not.
        ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
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
