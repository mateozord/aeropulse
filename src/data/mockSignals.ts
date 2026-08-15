import type { AirportSignal } from "../types/signal";
import { computeScore } from "../score/engine";

function signal(
  iata: string,
  weather: Omit<AirportSignal["weather"], "source">,
  observedAircraft: number,
  trend: AirportSignal["trend"],
  timeline: number[],
): AirportSignal {
  const fullWeather: AirportSignal["weather"] = { ...weather, source: "mock" };
  const { score, status, drivers } = computeScore(fullWeather);

  return {
    iata,
    score,
    status,
    drivers,
    weather: fullWeather,
    traffic: { observedAircraft, source: "mock" },
    trend,
    timeline: ["AGORA", "+3h", "+6h", "+12h"].map((label, i) => ({ label, value: timeline[i] })),
  };
}

/**
 * Hand-authored mock weather for Fase 2 (UI validation) and as a fallback
 * when Open-Meteo is unreachable. Score/status/drivers are derived from it
 * by the same AeroPulse Engine used for live data — see src/score/engine.ts.
 */
export const MOCK_SIGNALS: Record<string, AirportSignal> = {
  GRU: signal(
    "GRU",
    { rainChance: 8, windSpeed: 12, visibility: "Good", temperature: 22 },
    38, "Stable", [24, 26, 22, 25],
  ),
  CGH: signal(
    "CGH",
    { rainChance: 5, windSpeed: 10, visibility: "Good", temperature: 23 },
    21, "Stable", [18, 17, 19, 18],
  ),
  GIG: signal(
    "GIG",
    { rainChance: 34, windSpeed: 16, visibility: "Moderate", temperature: 26 },
    27, "Rising", [30, 35, 39, 37],
  ),
  SDU: signal(
    "SDU",
    { rainChance: 15, windSpeed: 14, visibility: "Good", temperature: 27 },
    15, "Stable", [20, 22, 21, 22],
  ),
  BSB: signal(
    "BSB",
    { rainChance: 2, windSpeed: 9, visibility: "Good", temperature: 25 },
    24, "Stable", [16, 15, 14, 15],
  ),
  CNF: signal(
    "CNF",
    { rainChance: 20, windSpeed: 13, visibility: "Good", temperature: 21 },
    18, "Stable", [26, 28, 30, 27],
  ),
  REC: signal(
    "REC",
    { rainChance: 82, windSpeed: 41, visibility: "Poor", temperature: 24 },
    33, "Rising", [58, 67, 74, 71],
  ),
  SSA: signal(
    "SSA",
    { rainChance: 47, windSpeed: 22, visibility: "Moderate", temperature: 25 },
    29, "Rising", [33, 38, 41, 40],
  ),
  FOR: signal(
    "FOR",
    { rainChance: 10, windSpeed: 17, visibility: "Good", temperature: 28 },
    17, "Stable", [20, 19, 18, 19],
  ),
  POA: signal(
    "POA",
    { rainChance: 18, windSpeed: 47, visibility: "Moderate", temperature: 14 },
    16, "Falling", [63, 58, 55, 52],
  ),
};
