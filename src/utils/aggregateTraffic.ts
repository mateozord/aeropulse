import { AIRPORTS } from "../data/airports.ts";
import { haversineKm } from "./geo.ts";
import type { Airport } from "../types/airport.ts";

// Radius around each airport counted as "observed" traffic. Wide enough to
// capture arrivals/departures on approach, not just aircraft on the ground.
const RADIUS_KM = 50;

export type OpenSkyState = [
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
];

export type OpenSkyResponse = {
  time: number;
  states: OpenSkyState[] | null;
};

/** Counts aircraft within RADIUS_KM of each monitored airport. Pure — shared by the browser hook and the Node snapshot script. */
export function countAircraftByAirport(
  states: OpenSkyState[],
  airports: Airport[] = AIRPORTS,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const airport of airports) {
    let observed = 0;
    for (const state of states) {
      const lon = state[5];
      const lat = state[6];
      if (lat === null || lon === null) continue;
      if (haversineKm(airport.lat, airport.lon, lat, lon) <= RADIUS_KM) {
        observed += 1;
      }
    }
    counts[airport.iata] = observed;
  }
  return counts;
}
