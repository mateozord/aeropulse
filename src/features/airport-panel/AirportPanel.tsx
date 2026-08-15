import { Link } from "react-router-dom";
import type { Airport } from "../../types/airport";
import type { AirportSignal } from "../../types/signal";
import type { WeatherSyncStatus } from "../weather/useWeatherSignals";
import type { TrafficSyncStatus } from "../traffic/useTrafficSignals";
import { AnimatedNumber } from "../../components/AnimatedNumber";
import { MockBadge } from "../../components/MockBadge";
import { SourceTag } from "../../components/SourceTag";
import { StatusBadge } from "../../components/StatusBadge";
import { ScoreBreakdown } from "../../components/ScoreBreakdown";
import { STATUS_COLOR, TREND_LABEL_PT, VISIBILITY_LABEL_PT } from "../../utils/status";

type Props = {
  airport: Airport | null;
  signal: AirportSignal | null;
  weatherStatus: WeatherSyncStatus;
  trafficStatus: TrafficSyncStatus;
  onClose: () => void;
};

const TREND_ARROW: Record<string, string> = {
  Rising: "↑",
  Falling: "↓",
  Stable: "→",
};

export function AirportPanel({ airport, signal, weatherStatus, trafficStatus, onClose }: Props) {
  const open = airport !== null && signal !== null;

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-40 w-full max-w-sm transform border-l border-border bg-surface transition-transform duration-300 ease-out ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      aria-hidden={!open}
    >
      {airport && signal && (
        <div className="flex h-full flex-col overflow-y-auto p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-2xl font-semibold text-foreground">{airport.iata}</p>
              <p className="text-sm text-muted">{airport.city} · {airport.name}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-border px-2 py-1 text-xs text-muted transition-colors hover:border-border-strong hover:text-foreground"
              aria-label="Fechar painel"
            >
              Fechar
            </button>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">Score AeroPulse</p>
              <p className="text-5xl font-semibold tabular-nums text-foreground">
                <AnimatedNumber value={signal.score} />
                <span className="text-lg text-muted">/100</span>
              </p>
            </div>
            <div className="text-right">
              <StatusBadge status={signal.status} />
              <div className="mt-2">
                <SourceTag source={signal.weather.source} label="AeroPulse Engine" />
              </div>
            </div>
          </div>
          <ScoreBreakdown signal={signal} />

          <section className="mt-8">
            <p className="text-xs uppercase tracking-wider text-muted">Principais fatores</p>
            <ul className="mt-2 space-y-1.5">
              {signal.drivers.map((driver) => (
                <li key={driver} className="flex items-center gap-2 text-sm text-foreground">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: STATUS_COLOR[signal.status] }}
                  />
                  {driver}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted">Clima</p>
              <SourceTag source={signal.weather.source} label="Open-Meteo" />
            </div>
            {signal.weather.source === "mock" && (
              <p className="mt-1 text-[11px] text-muted">
                {weatherStatus === "syncing"
                  ? "Sincronizando dados ao vivo…"
                  : "Não foi possível atualizar os dados do clima. Mostrando valores de exemplo."}
              </p>
            )}
            <dl className="mt-3 grid grid-cols-3 gap-4">
              <div>
                <dt className="text-[11px] text-muted">Chuva</dt>
                <dd className="text-lg font-medium text-foreground">{signal.weather.rainChance}%</dd>
              </div>
              <div>
                <dt className="text-[11px] text-muted">Vento</dt>
                <dd className="text-lg font-medium text-foreground">{signal.weather.windSpeed} km/h</dd>
              </div>
              <div>
                <dt className="text-[11px] text-muted">Visibilidade</dt>
                <dd className="text-lg font-medium text-foreground">{VISIBILITY_LABEL_PT[signal.weather.visibility]}</dd>
              </div>
            </dl>
          </section>

          <section className="mt-8 border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted">Tráfego aéreo</p>
              <SourceTag source={signal.traffic.source} label="OpenSky" />
            </div>
            {signal.traffic.source === "mock" && (
              <p className="mt-1 text-[11px] text-muted">
                {trafficStatus === "syncing"
                  ? "Sincronizando dados ao vivo…"
                  : "Não foi possível atualizar os dados de tráfego. Mostrando valores de exemplo."}
              </p>
            )}
            <dl className="mt-3">
              <dt className="text-[11px] text-muted">Aeronaves observadas (raio de 50km)</dt>
              <dd className="text-lg font-medium text-foreground">{signal.traffic.observedAircraft}</dd>
            </dl>
          </section>

          <section className="mt-8 border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted">Tendência</p>
              <MockBadge />
            </div>
            <p className="mt-2 text-lg font-medium text-foreground">
              {TREND_ARROW[signal.trend]} {TREND_LABEL_PT[signal.trend]}
            </p>
          </section>

          <Link
            to={`/airports/${airport.iata}`}
            className="mt-auto flex items-center justify-center border-t border-border pt-6 text-sm text-accent hover:text-foreground"
          >
            Ver detalhe completo →
          </Link>

          <p className="mt-4 text-[11px] leading-relaxed text-muted">
            O Score AeroPulse é um sinal experimental calculado por este app, não é um indicador
            oficial de aviação. Ele não prevê atrasos, cancelamentos ou operações reais.
          </p>
        </div>
      )}
    </aside>
  );
}
