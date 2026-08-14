import { AIRPORTS } from "../data/airports";
import { haversineKm } from "../utils/geo";
import type { TrafficSignal } from "../types/signal";

// Radius around each airport counted as "observed" traffic. Wide enough to
// capture arrivals/departures on approach, not just aircraft on the ground.
const RADIUS_KM = 50;

type OpenSkyResponse = {
  time: number;
  states: Array<
    [
      string, // icao24
      string | null, // callsign
      string, // origin_country
      number | null, // time_position
      number, // last_contact
      number | null, // longitude
      number | null, // latitude
      number | null, // baro_altitude
      boolean, // on_ground
      number | null, // velocity
      number | null, // true_track
      number | null, // vertical_rate
      number[] | null, // sensors
      number | null, // geo_altitude
      string | null, // squawk
      boolean, // spi
      number, // position_source
      number, // category
    ]
  > | null;
};

/**
 * Fetches current Brazilian airspace traffic via our dev-server proxy
 * (OpenSky blocks direct browser calls with CORS) and counts aircraft
 * within RADIUS_KM of each monitored airport.
 */
export async function fetchLiveTraffic(): Promise<Record<string, TrafficSignal>> {
  const response = await fetch("/api/traffic");
  if (!response.ok) {
    throw new Error(`Traffic proxy request failed with status ${response.status}`);
  }

  const data = (await response.json()) as OpenSkyResponse;
  const states = data.states ?? [];
  const fetchedAt = new Date().toISOString();

  const counts: Record<string, TrafficSignal> = {};
  for (const airport of AIRPORTS) {
    let observed = 0;
    for (const state of states) {
      const lon = state[5];
      const lat = state[6];
      if (lat === null || lon === null) continue;
      if (haversineKm(airport.lat, airport.lon, lat, lon) <= RADIUS_KM) {
        observed += 1;
      }
    }
    counts[airport.iata] = { observedAircraft: observed, source: "live", fetchedAt };
  }

  return counts;
}
