import type { Plugin } from "vite";
import { fetchBrazilStatesRaw } from "./openskyClient.ts";
import { memoize } from "./memoize.ts";
import { countAircraftByAirport } from "../src/utils/aggregateTraffic.ts";
import type { OpenSkyResponse } from "../src/utils/aggregateTraffic.ts";

// Anonymous OpenSky access grants 400 credits/day; caching keeps a real
// site's traffic from burning through that budget on repeat visits.
// Aggregates server-side so the response shape matches production
// (netlify/functions/traffic.mts), which reads pre-aggregated counts from
// Supabase instead — see that file for why it doesn't call OpenSky directly.
const getTrafficCounts = memoize(async () => {
  const raw = await fetchBrazilStatesRaw();
  const { states } = JSON.parse(raw) as OpenSkyResponse;
  return countAircraftByAirport(states ?? []);
}, 5 * 60 * 1000);

/**
 * OpenSky only sends CORS headers back to its own origin, so the browser
 * can't call it directly — this dev-only proxy calls it server-side instead.
 */
export function openSkyDevProxy(): Plugin {
  return {
    name: "opensky-dev-proxy",
    configureServer(server) {
      server.middlewares.use("/api/traffic", async (_req, res) => {
        try {
          const counts = await getTrafficCounts();
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(counts));
        } catch (err) {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: (err as Error).message }));
        }
      });
    },
  };
}
