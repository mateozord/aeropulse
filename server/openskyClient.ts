// Covers Brazil + a margin so border-adjacent airports (e.g. POA) still
// pick up nearby traffic. Costs 4 OpenSky credits per call (>400 sq°).
const BBOX = { lamin: -33.75, lomin: -73.99, lamax: 5.27, lomax: -34.79 };

/**
 * Fetches raw OpenSky state vectors for Brazilian airspace. Server-only:
 * OpenSky's CORS only allows its own origin, so this must run outside the
 * browser (Vite dev middleware, or the scheduled snapshot script).
 */
export async function fetchBrazilStatesRaw(): Promise<string> {
  const url = `https://opensky-network.org/api/states/all?lamin=${BBOX.lamin}&lomin=${BBOX.lomin}&lamax=${BBOX.lamax}&lomax=${BBOX.lomax}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OpenSky request failed with status ${response.status}`);
  }
  return response.text();
}
