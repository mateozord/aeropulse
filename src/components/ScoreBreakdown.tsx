import type { AirportSignal } from "../types/signal";
import { getSubSignals } from "../score/signals";

export function ScoreBreakdown({ signal }: { signal: AirportSignal }) {
  const subSignals = getSubSignals(signal);

  return (
    <div className="mt-4 border-t border-border pt-4">
      <dl className="grid grid-cols-3 gap-4">
        {subSignals.map((s) => (
          <div key={s.label}>
            <dt className="text-[11px] uppercase tracking-wider text-muted">{s.label}</dt>
            <dd
              className={`mt-0.5 text-lg font-medium tabular-nums ${
                s.value === null ? "text-muted" : "text-foreground"
              }`}
            >
              {s.value === null ? "N/D" : s.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[11px] leading-relaxed text-muted">
        Em v1, o AeroPulse Score é baseado principalmente no Sinal de clima — os demais sinais ainda
        não entram no cálculo.
      </p>
    </div>
  );
}
