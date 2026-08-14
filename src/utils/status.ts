import type { AeroPulseStatus } from "../types/airport";

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
