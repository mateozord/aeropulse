import { useMemo, useState } from "react";
import { AIRPORTS } from "../data/airports";
import { AirportMap } from "../features/map/AirportMap";
import { AirportPanel } from "../features/airport-panel/AirportPanel";
import type { useWeatherSignals } from "../features/weather/useWeatherSignals";
import type { useTrafficSignals } from "../features/traffic/useTrafficSignals";
import { useAirportSignals } from "../features/signals/useAirportSignals";
import { StatusBadge } from "../components/StatusBadge";
import { SyncCard } from "../components/SyncCard";
import { SystemNominal } from "../components/SystemNominal";
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
    <section className="mx-auto max-w-7xl px-6 py-10 md:py-12">
      <p className="animate-fade-in-up text-xs uppercase tracking-[0.3em] text-accent">
        Plataforma Experimental de Inteligência em Aviação
      </p>
      <h1
        className="animate-fade-in-up mt-3 text-4xl font-semibold tracking-tight text-foreground md:text-6xl"
        style={{ animationDelay: "60ms" }}
      >
        AeroPulse
      </h1>
      <p className="animate-fade-in-up mt-2 text-xl text-muted" style={{ animationDelay: "120ms" }}>
        Inteligência em Aviação
      </p>
      <p className="animate-fade-in-up mt-3 max-w-xl text-base text-muted" style={{ animationDelay: "180ms" }}>
        Entenda o que está acontecendo no céu.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        <div
          className="animate-fade-in-up h-[560px] overflow-hidden rounded-lg border border-border"
          style={{ animationDelay: "240ms" }}
        >
          <AirportMap statusByIata={statusByIata} selectedIata={selectedIata} onSelect={setSelectedIata} />
        </div>

        <div
          className="animate-fade-in-up flex flex-col rounded-lg border border-border bg-surface"
          style={{ animationDelay: "300ms" }}
        >
          <p className="px-5 pt-4 text-xs uppercase tracking-[0.2em] text-muted">Status do sistema</p>

          <div className="mt-3 flex flex-col divide-y divide-border">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-xs uppercase tracking-wider text-muted">Aeroportos monitorados</span>
              <span className="font-mono text-xl tabular-nums text-foreground">
                <AnimatedNumber value={AIRPORTS.length} />
              </span>
            </div>

            <div className="px-5 py-4">
              {attentionAirports.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-muted">Precisam de atenção</span>
                    <span className="font-mono text-xl tabular-nums text-foreground">
                      <AnimatedNumber value={attentionAirports.length} />
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {attentionAirports.map((a) => (
                      <li key={a.iata}>
                        <button
                          type="button"
                          onClick={() => setSelectedIata(a.iata)}
                          className="flex w-full items-center gap-3 text-sm text-foreground transition-colors hover:text-accent"
                        >
                          <span className="w-9 shrink-0 font-mono">{a.iata}</span>
                          <span className="w-7 shrink-0 font-mono tabular-nums text-muted">
                            {signals[a.iata].score}
                          </span>
                          <span className="ml-auto">
                            <StatusBadge status={signals[a.iata].status} />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <SystemNominal />
              )}
            </div>

            <div className="px-5 py-4">
              <SyncCard
                title="Sincronização do clima"
                status={weather.status}
                lastUpdated={weather.lastUpdated}
                onRefresh={weather.sync}
              />
            </div>
            <div className="px-5 py-4">
              <SyncCard
                title="Sincronização do tráfego"
                status={traffic.status}
                lastUpdated={traffic.lastUpdated}
                onRefresh={traffic.sync}
              />
            </div>
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
