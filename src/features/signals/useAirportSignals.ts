import { useMemo } from "react";
import { MOCK_SIGNALS } from "../../data/mockSignals";
import { computeScore } from "../../score/engine";
import type { useWeatherSignals } from "../weather/useWeatherSignals";
import type { useTrafficSignals } from "../traffic/useTrafficSignals";

/**
 * Merges live weather/traffic (when available) with the mock fallback data,
 * recomputing the score from whichever weather is currently in play. This is
 * the single source of truth other pages should read airport signals from.
 */
export function useAirportSignals(
  weather: ReturnType<typeof useWeatherSignals>,
  traffic: ReturnType<typeof useTrafficSignals>,
) {
  return useMemo(() => {
    const merged: typeof MOCK_SIGNALS = {};
    for (const [iata, mock] of Object.entries(MOCK_SIGNALS)) {
      const currentWeather = weather.weatherByIata[iata] ?? mock.weather;
      const { score, status, drivers } = computeScore(currentWeather);
      merged[iata] = {
        ...mock,
        weather: currentWeather,
        traffic: traffic.trafficByIata[iata] ?? mock.traffic,
        score,
        status,
        drivers,
      };
    }
    return merged;
  }, [weather.weatherByIata, traffic.trafficByIata]);
}
