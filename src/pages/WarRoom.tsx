import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AIRPORTS } from "../data/airports";
import { AirportMap } from "../features/map/AirportMap";
import { LiveClock } from "../features/war-room/LiveClock";
import { StatusBadge } from "../components/StatusBadge";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { useAirportSignals } from "../features/signals/useAirportSignals";
import type { useWeatherSignals } from "../features/weather/useWeatherSignals";
import type { useTrafficSignals } from "../features/traffic/useTrafficSignals";

type Props = {
  weather: ReturnType<typeof useWeatherSignals>;
  traffic: ReturnType<typeof useTrafficSignals>;
};

function formatTime(date: Date | null) {
  if (!date) return "—";
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function WarRoom({ weather, traffic }: Props) {
  const navigate = useNavigate();
  const signals = useAirportSignals(weather, traffic);
  const live = weather.lastUpdated !== null;

  const attentionAirports = useMemo(
    () => AIRPORTS.filter((a) => signals[a.iata].status !== "NORMAL"),
    [signals],
  );

  const statusByIata = useMemo(
    () => Object.fromEntries(AIRPORTS.map((a) => [a.iata, signals[a.iata].status])),
    [signals],
  );

  const totalObserved = useMemo(
    () => AIRPORTS.reduce((sum, a) => sum + signals[a.iata].traffic.observedAircraft, 0),
    [signals],
  );

  const mainSignals = useMemo(
    () =>
      attentionAirports
        .flatMap((a) => signals[a.iata].drivers.map((driver) => `${a.iata} — ${driver}`))
        .slice(0, 6),
    [attentionAirports, signals],
  );

  const goToAirport = (iata: string) => navigate(`/airports/${iata}`);

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col bg-base">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
        <div className="flex items-baseline gap-4">
          <span className="text-sm font-semibold tracking-[0.2em] text-foreground">AEROPULSE</span>
          <span className="hidden text-sm uppercase tracking-[0.2em] text-muted sm:inline">
            Aviação Brasil
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <span
            className={`hidden items-center gap-2 text-xs uppercase tracking-wider sm:flex ${
              live ? "text-accent" : "text-attention"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${live ? "animate-breathe bg-accent" : "bg-attention"}`}
            />
            {live ? "Sinal ao vivo" : "Dados simulados"}
          </span>
          <LiveClock />
          <Link
            to="/"
            className="text-xs uppercase tracking-wider text-muted transition-colors hover:text-foreground"
          >
            Sair
          </Link>
        </div>
      </header>

      {/* Desktop / tablet: map + sidebar. Small screens get a compact list instead. */}
      <div className="hidden min-h-0 flex-1 md:flex">
        <div className="flex-1">
          <AirportMap statusByIata={statusByIata} selectedIata={null} onSelect={goToAirport} />
        </div>

        <aside className="flex w-80 shrink-0 flex-col gap-6 overflow-y-auto border-l border-border p-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">Aeroportos monitorados</p>
            <p className="mt-1 font-mono text-3xl tabular-nums text-foreground">
              <AnimatedNumber value={AIRPORTS.length} />
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-muted">Aeronaves observadas</p>
            <p className="mt-1 font-mono text-3xl tabular-nums text-foreground">
              <AnimatedNumber value={totalObserved} />
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-xs uppercase tracking-wider text-muted">
              Aeroportos em atenção ({attentionAirports.length})
            </p>
            {attentionAirports.length === 0 ? (
              <p className="mt-2 text-sm text-muted">Nenhum no momento.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {attentionAirports.map((a) => (
                  <li key={a.iata}>
                    <button
                      type="button"
                      onClick={() => goToAirport(a.iata)}
                      className="flex w-full items-center justify-between text-sm text-foreground transition-colors hover:text-accent"
                    >
                      <span>{a.iata}</span>
                      <StatusBadge status={signals[a.iata].status} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-xs uppercase tracking-wider text-muted">Principais sinais</p>
            {mainSignals.length === 0 ? (
              <p className="mt-2 text-sm text-muted">Nenhum sinal elevado detectado.</p>
            ) : (
              <ul className="mt-3 space-y-1.5">
                {mainSignals.map((line) => (
                  <li key={line} className="text-sm text-foreground">
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-auto border-t border-border pt-6 text-xs text-muted">
            Clima atualizado às {formatTime(weather.lastUpdated)} · Tráfego atualizado às{" "}
            {formatTime(traffic.lastUpdated)}
          </div>
        </aside>
      </div>

      {/* Mobile: compact scrollable signal list instead of the map layout. */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 md:hidden">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Aeroportos</p>
            <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
              <AnimatedNumber value={AIRPORTS.length} />
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Aeronaves</p>
            <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
              <AnimatedNumber value={totalObserved} />
            </p>
          </div>
        </div>

        <p className="mt-6 text-xs uppercase tracking-wider text-muted">Todos os aeroportos</p>
        <ul className="mt-3 space-y-1">
          {AIRPORTS.map((a) => (
            <li key={a.iata}>
              <button
                type="button"
                onClick={() => goToAirport(a.iata)}
                className="flex w-full items-center justify-between rounded border border-border bg-surface px-4 py-3 text-sm text-foreground transition-colors active:bg-surface-raised"
              >
                <span className="font-mono">{a.iata}</span>
                <StatusBadge status={signals[a.iata].status} />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 text-xs text-muted">
          Clima atualizado às {formatTime(weather.lastUpdated)} · Tráfego atualizado às{" "}
          {formatTime(traffic.lastUpdated)}
        </div>
      </div>
    </div>
  );
}
