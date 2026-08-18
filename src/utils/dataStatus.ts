import type { TrafficSignal, WeatherSignal } from "../types/signal";
import { minutesSince } from "./freshness";
import { WEATHER_STALE_MINUTES } from "./constants";

export type DataStatus = {
  source: "live" | "mock" | "unavailable";
  stale: boolean;
  fetchedAt?: string;
};

/**
 * Decides how a data source may honestly describe itself. "Ao vivo" is only
 * used when the reading is both real and recent — otherwise callers fall
 * back to a relative-time label instead of overclaiming freshness.
 */
export function weatherDataStatus(weather: WeatherSignal): DataStatus {
  if (weather.source === "mock") return { source: "mock", stale: false };
  const mins = minutesSince(weather.fetchedAt);
  return { source: "live", stale: mins !== null && mins > WEATHER_STALE_MINUTES, fetchedAt: weather.fetchedAt };
}

export function trafficDataStatus(traffic: TrafficSignal): DataStatus {
  if (traffic.source === "mock") return { source: "mock", stale: false };
  if (traffic.availability === "unavailable") return { source: "unavailable", stale: false };
  return {
    source: "live",
    stale: traffic.availability === "stale",
    fetchedAt: traffic.fetchedAt,
  };
}
