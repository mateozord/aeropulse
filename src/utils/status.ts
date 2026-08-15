import type { AeroPulseStatus } from "../types/airport";
import type { Trend, Visibility } from "../types/signal";

export function statusFromScore(score: number): AeroPulseStatus {
  if (score >= 70) return "HIGH";
  if (score >= 50) return "ELEVATED";
  if (score >= 30) return "ATTENTION";
  return "NORMAL";
}

export const STATUS_COLOR: Record<AeroPulseStatus, string> = {
  NORMAL: "var(--color-normal)",
  ATTENTION: "var(--color-attention)",
  ELEVATED: "var(--color-elevated)",
  HIGH: "var(--color-high)",
};

export const STATUS_TEXT_CLASS: Record<AeroPulseStatus, string> = {
  NORMAL: "text-normal",
  ATTENTION: "text-attention",
  ELEVATED: "text-elevated",
  HIGH: "text-high",
};

// Internal values stay in English (used in comparisons throughout the code);
// these maps translate them only at the point of display.
export const STATUS_LABEL_PT: Record<AeroPulseStatus, string> = {
  NORMAL: "NORMAL",
  ATTENTION: "ATENÇÃO",
  ELEVATED: "ELEVADO",
  HIGH: "ALTO",
};

export const VISIBILITY_LABEL_PT: Record<Visibility, string> = {
  Good: "Boa",
  Moderate: "Moderada",
  Poor: "Ruim",
};

export const TREND_LABEL_PT: Record<Trend, string> = {
  Rising: "Subindo",
  Falling: "Caindo",
  Stable: "Estável",
};
