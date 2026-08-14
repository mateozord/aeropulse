# AeroPulse

**Experimental Aviation Intelligence Platform.** Cross-references live weather, observed air
traffic, and historical trends for major Brazilian airports into an experimental 0–100 signal (the
_AeroPulse Score_) — see [`/methodology`](https://github.com/mateozord/aeropulse) once deployed for
exactly how it's calculated.

AeroPulse does not predict delays, cancellations, or real airline operations. It's an experimental
signal computed by this app, not an official aviation indicator.

> Full documentation (architecture, data sources, methodology, screenshots, how to run) is being
> written as the project's final phase. This README will be replaced then.

## Stack

Vite + React + TypeScript + Tailwind CSS, MapLibre GL JS, Recharts, Supabase (history), GitHub
Actions (scheduled data capture). Data: [Open-Meteo](https://open-meteo.com) (weather),
[OpenSky Network](https://opensky-network.org) (traffic), [OpenFreeMap](https://openfreemap.org)
(map tiles).

## Running locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in a Supabase project's URL/keys to enable score
history (optional — the app works with mock fallbacks if unset for weather/traffic, but history
requires Supabase).
