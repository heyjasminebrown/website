import { pingSupabase } from "@/lib/leads";

// Called once a day by Vercel (see vercel.json) so the free Supabase project isn't paused for inactivity.
export async function GET(request: Request) {
  // Vercel sends this header when CRON_SECRET is set, so only its scheduler can trigger the check-in.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const ok = await pingSupabase();
  return Response.json({ ok }, { status: ok ? 200 : 502 });
}
