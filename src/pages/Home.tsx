import { useMemo, useState } from "react";
import { AIRPORTS } from "../data/airports";
import { AirportMap } from "../features/map/AirportMap";
import { AirportPanel } from "../features/airport-panel/AirportPanel";
import type { useWeatherSignals } from "../features/weather/useWeatherSignals";
import type { useTrafficSignals } from "../features/traffic/useTrafficSignals";
import { useAirportSignals } from "../features/signals/useAirportSignals";
import { StatusBadge } from "../components/StatusBadge";
import { SyncCard } from "../components/SyncCard";
import { AnimatedNumber } from "../components/AnimatedNumber";

type Props = {
  weather: ReturnType<typeof useWeatherSignals>;
  traffic: ReturnType<typeof useTrafficSignals>;
};

export function Home({ weather, traffic }: Props) {
  const [selectedIata, setSelectedIata] = useState<string | null>(null);
  const signals = useAirportSignals(weather, traffic);

  const attentionAirports = useMemo(
    () => AIRPORTS.filter((a) => signals[a.iata].status !== "NORMAL"),
    [signals],
  );

  const statusByIata = useMemo(
    () => Object.fromEntries(AIRPORTS.map((a) => [a.iata, signals[a.iata].status])),
    [signals],
  );

  const selectedAirport = AIRPORTS.find((a) => a.iata === selectedIata) ?? null;
  const selectedSignal = selectedIata ? signals[selectedIata] : null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <p className="animate-fade-in-up text-xs uppercase tracking-[0.3em] text-accent">
        Experimental Aviation Intelligence Platform
      </p>
      <h1
        className="animate-fade-in-up mt-4 text-5xl font-semibold tracking-tight text-foreground md:text-7xl"
        style={{ animationDelay: "60ms" }}
      >
        AeroPulse
      </h1>
      <p className="animate-fade-in-up mt-2 text-2xl text-muted" style={{ animationDelay: "120ms" }}>
        Aviation Intelligence
      </p>
      <p className="animate-fade-in-up mt-6 max-w-xl text-lg text-muted" style={{ animationDelay: "180ms" }}>
        Understand what's happening in the sky.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
        <div
          className="animate-fade-in-up h-[560px] overflow-hidden rounded-lg border border-border"
          style={{ animationDelay: "240ms" }}
        >
          <AirportMap statusByIata={statusByIata} selectedIata={selectedIata} onSelect={setSelectedIata} />
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="animate-fade-in-up rounded-lg border border-border bg-surface p-5 transition-colors duration-300 hover:border-border-strong"
            style={{ animationDelay: "300ms" }}
          >
            <p className="text-xs uppercase tracking-wider text-muted">Monitored airports</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              <AnimatedNumber value={AIRPORTS.length} />
            </p>
          </div>

          <div
            className="animate-fade-in-up rounded-lg border border-border bg-surface p-5 transition-colors duration-300 hover:border-border-strong"
            style={{ animationDelay: "360ms" }}
          >
            <p className="text-xs uppercase tracking-wider text-muted">Needs attention</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              <AnimatedNumber value={attentionAirports.length} />
            </p>
            {attentionAirports.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {attentionAirports.map((a) => (
                  <li key={a.iata}>
                    <button
                      type="button"
                      onClick={() => setSelectedIata(a.iata)}
                      className="flex w-full items-center justify-between text-sm text-foreground transition-colors hover:text-accent"
                    >
                      <span>{a.iata}</span>
                      <StatusBadge status={signals[a.iata].status} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">None right now.</p>
            )}
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "420ms" }}>
            <SyncCard
              title="Weather sync"
              status={weather.status}
              lastUpdated={weather.lastUpdated}
              onRefresh={weather.sync}
            />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "480ms" }}>
            <SyncCard
              title="Traffic sync"
              status={traffic.status}
              lastUpdated={traffic.lastUpdated}
              onRefresh={traffic.sync}
            />
          </div>
        </div>
      </div>

      {selectedIata && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setSelectedIata(null)}
          aria-hidden="true"
        />
      )}
      <AirportPanel
        airport={selectedAirport}
        signal={selectedSignal}
        weatherStatus={weather.status}
        trafficStatus={traffic.status}
        onClose={() => setSelectedIata(null)}
      />
    </section>
  );
}
