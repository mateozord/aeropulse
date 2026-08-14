import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

/**
 * Serves the latest observed-aircraft count per airport from Supabase
 * (captured every 30 min by the GitHub Actions snapshot job) rather than
 * calling OpenSky directly. Netlify Functions run on shared cloud IP
 * ranges that OpenSky appears to throttle/stall — verified empirically:
 * ~1s from a residential connection, ~11s (timing out past Netlify's
 * 10s function limit) from this function. GitHub Actions runners reach
 * OpenSky fine, so let that existing job be the source of truth instead.
 */
export default async () => {
  try {
    const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("signal_snapshots")
      .select("airport_iata, observed_aircraft, captured_at")
      .gte("captured_at", since)
      .order("captured_at", { ascending: false });

    if (error) throw new Error(error.message);

    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      if (!(row.airport_iata in counts)) counts[row.airport_iata] = row.observed_aircraft;
    }

    return new Response(JSON.stringify(counts), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = { path: "/api/traffic" };
