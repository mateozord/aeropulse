import { useEffect, useState } from "react";
import { fetchScoreHistory } from "../../services/history";
import type { TrendPoint } from "../../types/signal";

type HistoryState = { status: "loading" | "ready" | "error"; points: TrendPoint[] };

/** Real score history for one airport, if any has been captured yet. */
export function useAirportHistory(iata: string) {
  const [state, setState] = useState<HistoryState>({ status: "loading", points: [] });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", points: [] });

    fetchScoreHistory(iata)
      .then((points) => {
        if (!cancelled) setState({ status: "ready", points });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", points: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [iata]);

  return state;
}
