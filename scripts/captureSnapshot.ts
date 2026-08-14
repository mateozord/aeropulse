import { createClient } from "@supabase/supabase-js";
import { AIRPORTS } from "../src/data/airports";
import { fetchLiveWeather } from "../src/services/openMeteo";
import { computeScore } from "../src/score/engine";
import { countAircraftByAirport } from "../src/utils/aggregateTraffic";
import type { OpenSkyResponse } from "../src/utils/aggregateTraffic";
import { fetchBrazilStatesRaw } from "../server/openskyClient";

/**
 * Runs on a schedule (GitHub Actions, see .github/workflows/snapshot.yml).
 * Fetches current weather + traffic for every monitored airport and writes
 * one row per airport to signal_snapshots — the data source for real trend
 * history (Fase 10). Uses the service_role key, which bypasses Row Level
 * Security, so it must only ever run server-side (CI), never in the browser.
 */
async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const rawStates = await fetchBrazilStatesRaw();
  const { states } = JSON.parse(rawStates) as OpenSkyResponse;
  const trafficByIata = countAircraftByAirport(states ?? []);

  const rows = await Promise.all(
    AIRPORTS.map(async (airport) => {
      const weather = await fetchLiveWeather(airport.lat, airport.lon);
      const { score, status } = computeScore(weather);
      return {
        airport_iata: airport.iata,
        rain_chance: weather.rainChance,
        wind_speed: weather.windSpeed,
        visibility: weather.visibility,
        temperature: weather.temperature,
        observed_aircraft: trafficByIata[airport.iata] ?? 0,
        score,
        status,
      };
    }),
  );

  const { error } = await supabase.from("signal_snapshots").insert(rows);
  if (error) throw new Error(`Supabase insert failed: ${error.message}`);

  console.log(`Captured ${rows.length} snapshots at ${new Date().toISOString()}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
