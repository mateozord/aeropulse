import { AIRPORTS } from "../data/airports";
import type { TrafficSignal } from "../types/signal";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { minutesSince } from "../utils/freshness";
import { TRAFFIC_STALE_MINUTES } from "../utils/constants";

type TrafficRow = { count: number; capturedAt: string };

/**
 * Fetches the observed-aircraft count per monitored airport via /api/traffic
 * — a dev-server proxy locally (live OpenSky), a Vercel Function in
 * production (latest Supabase snapshot). An airport missing from the
 * response means "no recent reading", not zero aircraft — never default it
 * to 0.
 */
export async function fetchLiveTraffic(): Promise<Record<string, TrafficSignal>> {
  const response = await fetchWithTimeout("/api/traffic");
  if (!response.ok) {
    throw new Error(`Traffic proxy request failed with status ${response.status}`);
  }

  const rows = (await response.json()) as Record<string, TrafficRow>;

  const result: Record<string, TrafficSignal> = {};
  for (const airport of AIRPORTS) {
    const row = rows[airport.iata];
    if (!row) {
      result[airport.iata] = { observedAircraft: null, availability: "unavailable", source: "live" };
      continue;
    }
    const age = minutesSince(row.capturedAt);
    result[airport.iata] = {
      observedAircraft: row.count,
      availability: age !== null && age > TRAFFIC_STALE_MINUTES ? "stale" : "available",
      source: "live",
      fetchedAt: row.capturedAt,
    };
  }
  return result;
}
