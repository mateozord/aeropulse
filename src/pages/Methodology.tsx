function Factor({ title, points, description }: { title: string; points: string; description: string }) {
  return (
    <div className="border-t border-border py-6">
      <div className="flex items-baseline justify-between">
        <p className="text-lg font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted">{points}</p>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
    </div>
  );
}

export function Methodology() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">How it works</p>
      <h1 className="mt-4 text-4xl font-semibold text-foreground">AeroPulse Score</h1>
      <p className="mt-4 text-muted">
        The AeroPulse Score is an experimental 0–100 signal computed by this app from weather
        conditions. It is not an official aviation indicator, and it does not predict delays,
        cancellations, or real airline operations. Treat it as a starting point for curiosity, not
        a source of truth.
      </p>

      <div className="mt-10 rounded-lg border border-border bg-surface p-5">
        <p className="text-xs uppercase tracking-wider text-muted">Status bands</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div><p className="text-normal font-semibold">NORMAL</p><p className="text-xs text-muted">0–29</p></div>
          <div><p className="text-attention font-semibold">ATTENTION</p><p className="text-xs text-muted">30–49</p></div>
          <div><p className="text-elevated font-semibold">ELEVATED</p><p className="text-xs text-muted">50–69</p></div>
          <div><p className="text-high font-semibold">HIGH</p><p className="text-xs text-muted">70–100</p></div>
        </div>
      </div>

      <h2 className="mt-12 text-xl font-semibold text-foreground">What goes into the score (v1)</h2>
      <p className="mt-2 text-sm text-muted">
        Version 1 is weather-only. Each factor contributes points up to its own cap, so no single
        factor can dominate the score by itself — and the app always lists which factors actually
        fired as "main drivers".
      </p>

      <div>
        <Factor
          title="Precipitation chance"
          points="up to 40 pts"
          description="Scales directly with the rain probability reported for the current hour (Open-Meteo). 100% chance contributes the full 40 points."
        />
        <Factor
          title="Wind speed"
          points="up to 35 pts"
          description="No contribution below 20 km/h. Above that, points scale with speed and cap at 35 once wind reaches roughly 40 km/h."
        />
        <Factor
          title="Visibility"
          points="0 / 15 / 35 pts"
          description="Good visibility contributes nothing, Moderate adds 15 points, Poor adds 35."
        />
      </div>

      <h2 className="mt-12 text-xl font-semibold text-foreground">What's deliberately left out</h2>
      <p className="mt-2 text-sm text-muted">
        Observed air traffic (via OpenSky) is shown in every airport panel as real, live data — but
        it is not part of the score yet. A raw aircraft count is meaningless without knowing what's
        normal for that specific airport: Guarulhos is busy on an ordinary Tuesday in a way Santos
        Dumont never is. Folding traffic into the score requires a historical baseline per airport,
        which AeroPulse doesn't have yet (that's a future phase). Trend (rising/falling/stable) is
        still illustrative/mock for the same reason — it needs history to be real.
      </p>

      <h2 className="mt-12 text-xl font-semibold text-foreground">Data sources</h2>
      <ul className="mt-2 space-y-1 text-sm text-muted">
        <li>Weather — <span className="text-foreground">Open-Meteo</span> (open data, CC-BY 4.0)</li>
        <li>Air traffic — <span className="text-foreground">OpenSky Network</span> (open data, anonymous access)</li>
        <li>Map — <span className="text-foreground">OpenFreeMap</span> / OpenStreetMap contributors</li>
      </ul>
    </section>
  );
}
