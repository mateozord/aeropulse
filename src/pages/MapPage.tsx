import { useMemo, useState } from "react";
import { AIRPORTS } from "../data/airports";
import { AirportMap } from "../features/map/AirportMap";
import { AirportPanel } from "../features/airport-panel/AirportPanel";
import { useAirportSignals } from "../features/signals/useAirportSignals";
import type { useWeatherSignals } from "../features/weather/useWeatherSignals";
import type { useTrafficSignals } from "../features/traffic/useTrafficSignals";
import type { AeroPulseStatus } from "../types/airport";
import { STATUS_LABEL_PT } from "../utils/status";

type Props = {
  weather: ReturnType<typeof useWeatherSignals>;
  traffic: ReturnType<typeof useTrafficSignals>;
};

const STATUS_FILTERS: AeroPulseStatus[] = ["NORMAL", "ATTENTION", "ELEVATED", "HIGH"];

/**
 * Dedicated geographic exploration view — distinct from the War Room, which
 * is the operational monitoring view (fullscreen, status counts, signal
 * feed). This page is just the map, a status filter, and the same airport
 * panel used elsewhere, kept intentionally light.
 */
export function MapPage({ weather, traffic }: Props) {
  const [selectedIata, setSelectedIata] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<AeroPulseStatus>>(new Set());
  const signals = useAirportSignals(weather, traffic);

  const statusByIata = useMemo(
    () => Object.fromEntries(AIRPORTS.map((a) => [a.iata, signals[a.iata].status])),
    [signals],
  );

  const visibleIata = useMemo(() => {
    if (activeFilters.size === 0) return null;
    return new Set(AIRPORTS.filter((a) => activeFilters.has(signals[a.iata].status)).map((a) => a.iata));
  }, [activeFilters, signals]);

  const toggleFilter = (status: AeroPulseStatus) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const selectedAirport = AIRPORTS.find((a) => a.iata === selectedIata) ?? null;
  const selectedSignal = selectedIata ? signals[selectedIata] : null;

  return (
    <section className="flex h-[calc(100dvh-65px)] flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Mapa</h1>
          <p className="text-xs text-muted">Exploração geográfica dos aeroportos monitorados.</p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por status">
          {STATUS_FILTERS.map((status) => {
            const active = activeFilters.has(status);
            return (
              <button
                key={status}
                type="button"
                onClick={() => toggleFilter(status)}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors ${
                  active
                    ? "border-accent text-accent"
                    : "border-border text-muted hover:border-border-strong hover:text-foreground"
                }`}
              >
                {STATUS_LABEL_PT[status]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative min-h-[420px] flex-1">
        <AirportMap
          statusByIata={statusByIata}
          selectedIata={selectedIata}
          onSelect={setSelectedIata}
          visibleIata={visibleIata}
        />
      </div>

      {selectedIata && (
        <div className="fixed inset-0 z-30" onClick={() => setSelectedIata(null)} aria-hidden="true" />
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
