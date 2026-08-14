import { useCallback, useEffect, useState } from "react";
import { fetchLiveTraffic } from "../../services/openSky";
import type { TrafficSignal } from "../../types/signal";
import { AUTO_REFRESH_MS } from "../../utils/constants";

export type TrafficSyncStatus = "idle" | "syncing" | "success" | "error";

export function useTrafficSignals() {
  const [trafficByIata, setTrafficByIata] = useState<Record<string, TrafficSignal>>({});
  const [status, setStatus] = useState<TrafficSyncStatus>("idle");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const sync = useCallback(async () => {
    setStatus("syncing");
    try {
      const counts = await fetchLiveTraffic();
      setTrafficByIata(counts);
      setLastUpdated(new Date());
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    sync();
    const interval = setInterval(sync, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [sync]);

  return { trafficByIata, status, lastUpdated, sync };
}
