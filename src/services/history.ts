import { supabase } from "./supabaseClient";
import type { TrendPoint } from "../types/signal";

function formatLabel(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

/** Real score history for one airport over the last `hours`, oldest first. */
export async function fetchScoreHistory(iata: string, hours = 24): Promise<TrendPoint[]> {
  if (!supabase) throw new Error("Supabase is not configured");

  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("signal_snapshots")
    .select("captured_at, score")
    .eq("airport_iata", iata)
    .gte("captured_at", since)
    .order("captured_at", { ascending: true });

  if (error) throw new Error(`History query failed: ${error.message}`);

  return (data ?? []).map((row) => ({ label: formatLabel(row.captured_at), value: row.score }));
}
