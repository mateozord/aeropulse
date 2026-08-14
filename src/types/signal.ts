import type { AeroPulseStatus } from "./airport";

export type Visibility = "Good" | "Moderate" | "Poor";

export type WeatherSignal = {
  rainChance: number; // %
  windSpeed: number; // km/h
  visibility: Visibility;
  temperature: number; // °C
  source: "live" | "mock";
  fetchedAt?: string; // ISO timestamp, only set when source is "live"
};

export type TrafficSignal = {
  observedAircraft: number;
  source: "live" | "mock";
  fetchedAt?: string; // ISO timestamp, only set when source is "live"
};

export type TrendPoint = {
  label: string; // "NOW", "+3h", "+6h", "+12h"
  value: number;
};

export type Trend = "Rising" | "Falling" | "Stable";

/**
 * Combined per-airport signal. `score`, `drivers`, `traffic` and `trend` are
 * hand-authored mock data (the AeroPulse Engine doesn't exist yet — Fase 6).
 * `weather` and `traffic` may be live (Open-Meteo / OpenSky) or fall back to
 * mock — check their `source` field.
 */
export type AirportSignal = {
  iata: string;
  score: number; // 0-100
  status: AeroPulseStatus;
  drivers: string[];
  weather: WeatherSignal;
  traffic: TrafficSignal;
  trend: Trend;
  timeline: TrendPoint[];
};
