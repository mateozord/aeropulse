/// <reference types="node" />
import { createClient } from "@supabase/supabase-js";

/**
 * Serves the latest observed-aircraft count per airport from Supabase
 * (captured every 30 min by the GitHub Actions snapshot job) rather than
 * calling OpenSky directly: OpenSky stalls/throttles when called from
 * shared cloud IP ranges (verified empirically — ~1s from a residential
 * connection, ~11s/timeout from a serverless function). GitHub Actions
 * runners reach OpenSky fine, so that existing job stays the source of
 * truth.
 */
export default {
  async fetch() {
    try {
      const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);
      const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from("signal_snapshots")
        .select("airport_iata, observed_aircraft, captured_at")
        .gte("captured_at", since)
        .order("captured_at", { ascending: false });

      if (error) throw new Error(error.message);

      const rows: Record<string, { count: number; capturedAt: string }> = {};
      for (const row of data ?? []) {
        if (!(row.airport_iata in rows)) {
          rows[row.airport_iata] = { count: row.observed_aircraft, capturedAt: row.captured_at };
        }
      }

      return Response.json(rows);
    } catch (err) {
      return Response.json({ error: (err as Error).message }, { status: 502 });
    }
  },
};
