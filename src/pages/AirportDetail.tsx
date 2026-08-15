import { Link, useParams } from "react-router-dom";
import { AIRPORTS } from "../data/airports";
import { useAirportSignals } from "../features/signals/useAirportSignals";
import { useAirportHistory } from "../features/airport-detail/useAirportHistory";
import { TrendChart } from "../features/airport-detail/TrendChart";
import { SourceTag } from "../components/SourceTag";
import { StatusBadge } from "../components/StatusBadge";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { ExplainSignal } from "../features/airport-detail/ExplainSignal";
import { STATUS_COLOR, VISIBILITY_LABEL_PT } from "../utils/status";
import type { useWeatherSignals } from "../features/weather/useWeatherSignals";
import type { useTrafficSignals } from "../features/traffic/useTrafficSignals";

type Props = {
  weather: ReturnType<typeof useWeatherSignals>;
  traffic: ReturnType<typeof useTrafficSignals>;
};

export function AirportDetail({ weather, traffic }: Props) {
  const { iata } = useParams<{ iata: string }>();
  const signals = useAirportSignals(weather, traffic);
  const airport = AIRPORTS.find((a) => a.iata === iata?.toUpperCase());
  // Called unconditionally (Rules of Hooks) even if the airport code is invalid.
  const history = useAirportHistory(airport?.iata ?? "");

  if (!airport) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-muted">Código de aeroporto desconhecido: "{iata}".</p>
        <Link to="/" className="mt-4 inline-block text-sm text-accent hover:underline">
          ← Voltar para a visão geral
        </Link>
      </section>
    );
  }

  const signal = signals[airport.iata];
  const hasRealHistory = history.status === "ready" && history.points.length >= 2;
  const trendTimeline = hasRealHistory ? history.points : signal.timeline;

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <Link to="/" className="text-sm text-muted transition-colors hover:text-accent">
        ← Visão geral
      </Link>

      <div className="animate-fade-in-up mt-6">
        <p className="text-sm text-muted">{airport.city}</p>
        <h1 className="mt-1 text-6xl font-semibold tracking-tight text-foreground">{airport.iata}</h1>
        <p className="mt-1 text-muted">{airport.name}</p>
      </div>

      <div
        className="animate-fade-in-up mt-10 flex items-center justify-between rounded-lg border border-border bg-surface p-6"
        style={{ animationDelay: "80ms" }}
      >
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">Score AeroPulse</p>
          <p className="mt-1 text-6xl font-semibold tabular-nums text-foreground">
            <AnimatedNumber value={signal.score} />
            <span className="text-xl text-muted">/100</span>
          </p>
        </div>
        <div className="text-right">
          <StatusBadge status={signal.status} />
          <div className="mt-2">
            <SourceTag source={signal.weather.source} label="AeroPulse Engine" />
          </div>
        </div>
      </div>

      <section className="animate-fade-in-up mt-6" style={{ animationDelay: "140ms" }}>
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
        <ExplainSignal
          payload={{
            iata: airport.iata,
            city: airport.city,
            score: signal.score,
            status: signal.status,
            drivers: signal.drivers,
            weather: signal.weather,
            traffic: signal.traffic,
          }}
        />
      </section>

      <section
        className="animate-fade-in-up mt-10 rounded-lg border border-border bg-surface p-6"
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">Tendência</p>
            <p className="text-[11px] text-muted">
              {hasRealHistory ? "Últimas 24h, capturado a cada 30 min" : "Exemplo ilustrativo, não é dado real"}
            </p>
          </div>
          <SourceTag source={hasRealHistory ? "live" : "mock"} label="Histórico" />
        </div>
        <TrendChart timeline={trendTimeline} status={signal.status} />
      </section>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          className="animate-fade-in-up rounded-lg border border-border bg-surface p-6"
          style={{ animationDelay: "260ms" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-muted">Clima</p>
            <SourceTag source={signal.weather.source} label="Open-Meteo" />
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-4">
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
        </div>

        <div
          className="animate-fade-in-up rounded-lg border border-border bg-surface p-6"
          style={{ animationDelay: "320ms" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-muted">Tráfego aéreo</p>
            <SourceTag source={signal.traffic.source} label="OpenSky" />
          </div>
          <dl className="mt-4">
            <dt className="text-[11px] text-muted">Aeronaves observadas (raio de 50km)</dt>
            <dd className="text-lg font-medium text-foreground">{signal.traffic.observedAircraft}</dd>
          </dl>
        </div>
      </div>

      <p className="mt-10 max-w-xl text-[11px] leading-relaxed text-muted">
        O Score AeroPulse é um sinal experimental calculado por este app, não é um indicador oficial
        de aviação. Ele não prevê atrasos, cancelamentos ou operações reais. Veja a{" "}
        <Link to="/methodology" className="text-accent hover:underline">
          Metodologia
        </Link>{" "}
        para entender como é calculado.
      </p>
    </section>
  );
}
