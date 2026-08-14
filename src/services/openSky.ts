import { AIRPORTS } from "../data/airports";
import { countAircraftByAirport } from "../utils/aggregateTraffic";
import type { OpenSkyResponse } from "../utils/aggregateTraffic";
import type { TrafficSignal } from "../types/signal";

/**
 * Fetches current Brazilian airspace traffic via our dev-server proxy
 * (OpenSky blocks direct browser calls with CORS) and counts aircraft
 * near each monitored airport.
 */
export async function fetchLiveTraffic(): Promise<Record<string, TrafficSignal>> {
  const response = await fetch("/api/traffic");
  if (!response.ok) {
    throw new Error(`Traffic proxy request failed with status ${response.status}`);
  }

  const data = (await response.json()) as OpenSkyResponse;
  const counts = countAircraftByAirport(data.states ?? []);
  const fetchedAt = new Date().toISOString();

  const result: Record<string, TrafficSignal> = {};
  for (const airport of AIRPORTS) {
    result[airport.iata] = { observedAircraft: counts[airport.iata], source: "live", fetchedAt };
  }
  return result;
}
