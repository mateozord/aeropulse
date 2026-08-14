import { createClient } from "@supabase/supabase-js";
import { AIRPORTS } from "../src/data/airports";
import { fetchLiveWeather } from "../src/services/openMeteo";
import { computeScore } from "../src/score/engine";
import { countAircraftByAirport } from "../src/utils/aggregateTraffic";
import type { OpenSkyResponse } from "../src/utils/aggregateTraffic";
import { fetchBrazilStatesRaw } from "../server/openskyClient";
import type { Airport } from "../src/types/airport";

async function buildRow(airport: Airport, trafficByIata: Record<string, number>) {
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
}

/**
 * Runs on a schedule (GitHub Actions, see .github/workflows/snapshot.yml).
 * Fetches current weather + traffic for every monitored airport and writes
 * one row per airport to signal_snapshots — the data source for real trend
 * history (Fase 10). Uses the service_role key, which bypasses Row Level
 * Security, so it must only ever run server-side (CI), never in the browser.
 *
 * A single flaky request (one airport's weather, or OpenSky itself) must not
 * cost the whole cycle — this runs unattended every 30 minutes, so isolated
 * failures are routine, not exceptional.
 */
async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  let trafficByIata: Record<string, number> = {};
  try {
    const rawStates = await fetchBrazilStatesRaw();
    const { states } = JSON.parse(rawStates) as OpenSkyResponse;
    trafficByIata = countAircraftByAirport(states ?? []);
  } catch (err) {
    console.warn(`OpenSky fetch failed, traffic will default to 0 this cycle: ${(err as Error).message}`);
  }

  const results = await Promise.allSettled(
    AIRPORTS.map((airport) => buildRow(airport, trafficByIata)),
  );

  const rows: Awaited<ReturnType<typeof buildRow>>[] = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      rows.push(r.value);
    } else {
      console.warn(`Weather fetch failed for ${AIRPORTS[i].iata}, skipping: ${r.reason}`);
    }
  });

  if (rows.length === 0) {
    console.warn("No snapshots captured this cycle — every airport's weather fetch failed.");
    return;
  }

  const { error } = await supabase.from("signal_snapshots").insert(rows);
  if (error) throw new Error(`Supabase insert failed: ${error.message}`);

  console.log(`Captured ${rows.length}/${AIRPORTS.length} snapshots at ${new Date().toISOString()}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
