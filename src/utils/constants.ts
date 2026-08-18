export const AUTO_REFRESH_MS = 5 * 60 * 1000;

// Weather is polled every AUTO_REFRESH_MS; anything older than a few missed
// cycles shouldn't be called "live" anymore.
export const WEATHER_STALE_MINUTES = 15;

// Traffic is captured by a GitHub Action every 30 min (see
// .github/workflows/snapshot.yml), not fetched live from the browser — a
// reading older than one missed cycle plus buffer counts as stale.
export const TRAFFIC_STALE_MINUTES = 45;
