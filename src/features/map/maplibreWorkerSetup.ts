import { setWorkerUrl } from "maplibre-gl";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

// Vite's production bundler doesn't auto-detect maplibre-gl's worker, so the
// plain worker URL 404s (and our SPA fallback redirect masks that as a 200
// HTML response, breaking the worker silently) — verified on the deployed
// site: tiles never rendered, only the background color showed. Explicitly
// pointing at the worker chunk via `?worker&url` fixes it.
setWorkerUrl(maplibreWorkerUrl);
