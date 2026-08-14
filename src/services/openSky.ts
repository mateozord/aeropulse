import { AIRPORTS } from "../data/airports";
import type { TrafficSignal } from "../types/signal";

/**
 * Fetches the observed-aircraft count per monitored airport via /api/traffic
 * — a dev-server proxy locally, a Netlify Function in production. Either
 * way the server does the aggregation; this just shapes it into TrafficSignal.
 */
export async function fetchLiveTraffic(): Promise<Record<string, TrafficSignal>> {
  const response = await fetch("/api/traffic");
  if (!response.ok) {
    throw new Error(`Traffic proxy request failed with status ${response.status}`);
  }

  const counts = (await response.json()) as Record<string, number>;
  const fetchedAt = new Date().toISOString();

  const result: Record<string, TrafficSignal> = {};
  for (const airport of AIRPORTS) {
    result[airport.iata] = { observedAircraft: counts[airport.iata] ?? 0, source: "live", fetchedAt };
  }
  return result;
}
