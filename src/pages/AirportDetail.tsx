import { Link, useParams } from "react-router-dom";
import { AIRPORTS } from "../data/airports";
import { useAirportSignals } from "../features/signals/useAirportSignals";
import { TrendChart } from "../features/airport-detail/TrendChart";
import { MockBadge } from "../components/MockBadge";
import { SourceTag } from "../components/SourceTag";
import { StatusBadge } from "../components/StatusBadge";
import { STATUS_COLOR } from "../utils/status";
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

  if (!airport) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-muted">Unknown airport code "{iata}".</p>
        <Link to="/" className="mt-4 inline-block text-sm text-accent hover:underline">
          ← Back to overview
        </Link>
      </section>
    );
  }

  const signal = signals[airport.iata];

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <Link to="/" className="text-sm text-muted hover:text-accent">
        ← Overview
      </Link>

      <div className="mt-6">
        <p className="text-sm text-muted">{airport.city}</p>
        <h1 className="mt-1 text-6xl font-semibold tracking-tight text-foreground">{airport.iata}</h1>
        <p className="mt-1 text-muted">{airport.name}</p>
      </div>

      <div className="mt-10 flex items-center justify-between rounded-lg border border-border bg-surface p-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">AeroPulse Score</p>
          <p className="mt-1 text-6xl font-semibold text-foreground">
            {signal.score}
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

      <section className="mt-6">
        <p className="text-xs uppercase tracking-wider text-muted">Main drivers</p>
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

      <section className="mt-10 rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wider text-muted">Trend</p>
          <MockBadge />
        </div>
        <TrendChart timeline={signal.timeline} status={signal.status} />
      </section>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-muted">Weather</p>
            <SourceTag source={signal.weather.source} label="Open-Meteo" />
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <dt className="text-[11px] text-muted">Rain</dt>
              <dd className="text-lg font-medium text-foreground">{signal.weather.rainChance}%</dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted">Wind</dt>
              <dd className="text-lg font-medium text-foreground">{signal.weather.windSpeed} km/h</dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted">Visibility</dt>
              <dd className="text-lg font-medium text-foreground">{signal.weather.visibility}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-muted">Air traffic</p>
            <SourceTag source={signal.traffic.source} label="OpenSky" />
          </div>
          <dl className="mt-4">
            <dt className="text-[11px] text-muted">Observed aircraft (50km radius)</dt>
            <dd className="text-lg font-medium text-foreground">{signal.traffic.observedAircraft}</dd>
          </dl>
        </div>
      </div>

      <p className="mt-10 max-w-xl text-[11px] leading-relaxed text-muted">
        AeroPulse Score is an experimental signal computed by this app, not an official aviation
        indicator. It does not predict delays, cancellations, or real operations. See{" "}
        <Link to="/methodology" className="text-accent hover:underline">
          Methodology
        </Link>{" "}
        for how it's calculated.
      </p>
    </section>
  );
}
