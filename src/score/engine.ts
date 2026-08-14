import type { AeroPulseStatus } from "../types/airport";
import type { WeatherSignal } from "../types/signal";
import { statusFromScore } from "../utils/status";

export type ScoreResult = {
  score: number;
  status: AeroPulseStatus;
  drivers: string[];
};

const RAIN_WEIGHT = 0.4; // 100% rain chance -> 40 points
const WIND_FREE_THRESHOLD = 20; // km/h below which wind contributes nothing
const WIND_WEIGHT = 1.75;
const WIND_CAP = 35;
const VISIBILITY_POINTS: Record<WeatherSignal["visibility"], number> = {
  Good: 0,
  Moderate: 15,
  Poor: 35,
};

/**
 * AeroPulse Score v1 — weather-only. Traffic isn't included yet: a raw
 * aircraft count means nothing without a per-airport historical baseline
 * (busy hubs like GRU would always look "elevated" otherwise) — that
 * baseline is Fase 10. See the Methodology page for the full writeup.
 */
export function computeScore(weather: WeatherSignal): ScoreResult {
  const rainPoints = weather.rainChance * RAIN_WEIGHT;
  const windPoints = Math.min(
    WIND_CAP,
    Math.max(0, weather.windSpeed - WIND_FREE_THRESHOLD) * WIND_WEIGHT,
  );
  const visibilityPoints = VISIBILITY_POINTS[weather.visibility];

  const score = Math.min(100, Math.round(rainPoints + windPoints + visibilityPoints));

  const drivers: string[] = [];
  if (weather.rainChance >= 60) drivers.push("Heavy precipitation");
  else if (weather.rainChance >= 25) drivers.push("Moderate rain");

  if (weather.windSpeed >= 40) drivers.push("Strong winds");
  else if (weather.windSpeed >= 25) drivers.push("Elevated winds");

  if (weather.visibility === "Poor") drivers.push("Low visibility");
  else if (weather.visibility === "Moderate") drivers.push("Reduced visibility");

  if (drivers.length === 0) drivers.push("Normal conditions");

  return { score, status: statusFromScore(score), drivers };
}
