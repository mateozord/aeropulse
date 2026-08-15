import type { AirportSignal } from "../types/signal";

export type SubSignal = { label: string; value: number | null };

/**
 * v1: the AeroPulse Score is 100% weather-derived, so the weather sub-signal
 * mirrors it exactly. Traffic and events aren't part of the methodology yet
 * (see the Methodology page) — surfaced as N/D instead of an invented number,
 * so this shape is ready for more signals without pretending they exist today.
 */
export function getSubSignals(signal: AirportSignal): SubSignal[] {
  return [
    { label: "Sinal de clima", value: signal.score },
    { label: "Sinal de tráfego aéreo", value: null },
    { label: "Sinal de eventos", value: null },
  ];
}
