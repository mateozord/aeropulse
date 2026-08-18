import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AIRPORTS } from "../data/airports";
import { useAirportSignals } from "../features/signals/useAirportSignals";
import type { useWeatherSignals } from "../features/weather/useWeatherSignals";
import type { useTrafficSignals } from "../features/traffic/useTrafficSignals";
import { StatusBadge } from "../components/StatusBadge";
import { formatCount } from "../utils/format";
import { formatRelativeUpdate } from "../utils/freshness";
import { weatherDataStatus } from "../utils/dataStatus";

type Props = {
  weather: ReturnType<typeof useWeatherSignals>;
  traffic: ReturnType<typeof useTrafficSignals>;
};

type SortKey = "score" | "iata";

export function AirportsPage({ weather, traffic }: Props) {
  const signals = useAirportSignals(weather, traffic);
  const [sortKey, setSortKey] = useState<SortKey>("score");

  const rows = useMemo(() => {
    const list = AIRPORTS.map((airport) => ({ airport, signal: signals[airport.iata] }));
    return list.sort((a, b) =>
      sortKey === "score" ? b.signal.score - a.signal.score : a.airport.iata.localeCompare(b.airport.iata),
    );
  }, [signals, sortKey]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Visão consolidada</p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground">Aeroportos</h1>
          <p className="mt-1 max-w-md text-sm text-muted">
            Quais aeroportos merecem atenção agora, num único lugar.
          </p>
        </div>
        <div className="flex gap-2 text-xs" role="group" aria-label="Ordenar lista">
          <button
            type="button"
            onClick={() => setSortKey("score")}
            aria-pressed={sortKey === "score"}
            className={`rounded-full border px-3 py-1 uppercase tracking-wider transition-colors ${
              sortKey === "score" ? "border-accent text-accent" : "border-border text-muted hover:text-foreground"
            }`}
          >
            Por score
          </button>
          <button
            type="button"
            onClick={() => setSortKey("iata")}
            aria-pressed={sortKey === "iata"}
            className={`rounded-full border px-3 py-1 uppercase tracking-wider transition-colors ${
              sortKey === "iata" ? "border-accent text-accent" : "border-border text-muted hover:text-foreground"
            }`}
          >
            Por IATA
          </button>
        </div>
      </div>

      {/* Desktop / tablet: table. Small screens get cards instead (no horizontal scrolling a data table). */}
      <div className="mt-8 hidden overflow-x-auto rounded-lg border border-border sm:block">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted">
              <th scope="col" className="px-4 py-3 font-medium">IATA</th>
              <th scope="col" className="px-4 py-3 font-medium">Cidade</th>
              <th scope="col" className="px-4 py-3 font-medium">Aeroporto</th>
              <th scope="col" className="px-4 py-3 font-medium">Score</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
              <th scope="col" className="px-4 py-3 font-medium">Sinal de clima</th>
              <th scope="col" className="px-4 py-3 font-medium">Sinal de tráfego</th>
              <th scope="col" className="px-4 py-3 font-medium">Última atualização</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map(({ airport, signal }) => {
              const status = weatherDataStatus(signal.weather);
              return (
                <tr key={airport.iata} className="transition-colors hover:bg-surface-raised">
                  <td className="px-4 py-3">
                    <Link
                      to={`/airports/${airport.iata}`}
                      className="font-mono text-foreground transition-colors hover:text-accent"
                    >
                      {airport.iata}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{airport.city}</td>
                  <td className="px-4 py-3 text-muted">{airport.name}</td>
                  <td className="px-4 py-3 font-mono tabular-nums text-foreground">{signal.score}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={signal.status} />
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums text-foreground">{signal.score}</td>
                  <td className="px-4 py-3 font-mono tabular-nums text-muted">
                    {formatCount(signal.traffic.observedAircraft)}
                  </td>
                  <td className="px-4 py-3 text-muted">{formatRelativeUpdate(status.fetchedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="mt-8 space-y-2 sm:hidden">
        {rows.map(({ airport, signal }) => (
          <li key={airport.iata}>
            <Link
              to={`/airports/${airport.iata}`}
              className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 transition-colors active:bg-surface-raised"
            >
              <div>
                <p className="font-mono text-foreground">{airport.iata}</p>
                <p className="text-xs text-muted">{airport.city}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono tabular-nums text-foreground">{signal.score}</span>
                <StatusBadge status={signal.status} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
