import { useCallback, useEffect, useState } from "react";
import { AIRPORTS } from "../../data/airports";
import { fetchLiveWeather } from "../../services/openMeteo";
import type { WeatherSignal } from "../../types/signal";
import { AUTO_REFRESH_MS } from "../../utils/constants";

export type WeatherSyncStatus = "idle" | "syncing" | "success" | "error";

export function useWeatherSignals() {
  const [weatherByIata, setWeatherByIata] = useState<Record<string, WeatherSignal>>({});
  const [status, setStatus] = useState<WeatherSyncStatus>("idle");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const sync = useCallback(async () => {
    setStatus("syncing");

    const results = await Promise.allSettled(
      AIRPORTS.map(async (airport) => {
        const weather = await fetchLiveWeather(airport.lat, airport.lon);
        return [airport.iata, weather] as const;
      }),
    );

    const fulfilled = results.filter(
      (r): r is PromiseFulfilledResult<readonly [string, WeatherSignal]> => r.status === "fulfilled",
    );

    if (fulfilled.length > 0) {
      setWeatherByIata((prev) => {
        const next = { ...prev };
        for (const { value } of fulfilled) {
          next[value[0]] = value[1];
        }
        return next;
      });
      setLastUpdated(new Date());
    }

    setStatus(fulfilled.length > 0 ? "success" : "error");
  }, []);

  useEffect(() => {
    sync();
    const interval = setInterval(sync, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [sync]);

  return { weatherByIata, status, lastUpdated, sync };
}
