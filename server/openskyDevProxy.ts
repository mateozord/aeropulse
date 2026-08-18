import type { Plugin } from "vite";
import { fetchBrazilStatesRaw } from "./openskyClient.ts";
import { memoize } from "./memoize.ts";
import { countAircraftByAirport } from "../src/utils/aggregateTraffic.ts";
import type { OpenSkyResponse } from "../src/utils/aggregateTraffic.ts";

// Anonymous OpenSky access grants 400 credits/day; caching keeps a real
// site's traffic from burning through that budget on repeat visits.
// Aggregates server-side so the response shape matches production
// (api/traffic.ts), which reads pre-aggregated counts from Supabase instead
// — see that file for why it doesn't call OpenSky directly.
const getTrafficCounts = memoize(async () => {
  const raw = await fetchBrazilStatesRaw();
  const { states } = JSON.parse(raw) as OpenSkyResponse;
  return countAircraftByAirport(states ?? []);
}, 5 * 60 * 1000);

/**
 * OpenSky only sends CORS headers back to its own origin, so the browser
 * can't call it directly — this dev-only proxy calls it server-side instead.
 * Response shape matches the production endpoint (api/traffic.ts): one
 * { count, capturedAt } row per airport, omitted entirely if unknown.
 */
export function openSkyDevProxy(): Plugin {
  return {
    name: "opensky-dev-proxy",
    configureServer(server) {
      server.middlewares.use("/api/traffic", async (_req, res) => {
        try {
          const counts = await getTrafficCounts();
          const capturedAt = new Date().toISOString();
          const rows: Record<string, { count: number; capturedAt: string }> = {};
          for (const [iata, count] of Object.entries(counts)) {
            rows[iata] = { count, capturedAt };
          }
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(rows));
        } catch (err) {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: (err as Error).message }));
        }
      });
    },
  };
}
