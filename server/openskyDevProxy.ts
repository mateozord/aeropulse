import type { Plugin } from "vite";

// Covers Brazil + a margin so border-adjacent airports (e.g. POA) still
// pick up nearby traffic. Costs 4 OpenSky credits per call (>400 sq°).
const BBOX = { lamin: -33.75, lomin: -73.99, lamax: 5.27, lomax: -34.79 };

// Anonymous OpenSky access grants 400 credits/day; caching keeps a real
// site's traffic from burning through that budget on repeat visits.
const CACHE_TTL_MS = 5 * 60 * 1000;

let cache: { body: string; fetchedAt: number } | null = null;

async function getBrazilTraffic(): Promise<string> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.body;
  }

  const url = `https://opensky-network.org/api/states/all?lamin=${BBOX.lamin}&lomin=${BBOX.lomin}&lamax=${BBOX.lamax}&lomax=${BBOX.lomax}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OpenSky request failed with status ${response.status}`);
  }

  const body = await response.text();
  cache = { body, fetchedAt: Date.now() };
  return body;
}

/**
 * OpenSky only sends CORS headers back to its own origin, so the browser
 * can't call it directly — this dev-only proxy calls it server-side instead.
 * A production deploy needs the same logic behind a serverless function (Fase 13).
 */
export function openSkyDevProxy(): Plugin {
  return {
    name: "opensky-dev-proxy",
    configureServer(server) {
      server.middlewares.use("/api/traffic", async (_req, res) => {
        try {
          const body = await getBrazilTraffic();
          res.setHeader("Content-Type", "application/json");
          res.end(body);
        } catch (err) {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: (err as Error).message }));
        }
      });
    },
  };
}
