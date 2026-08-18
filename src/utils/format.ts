/** Renders a possibly-unavailable count. Never collapses "unknown" into 0. */
export function formatCount(value: number | null): string {
  return value === null ? "N/D" : String(value);
}
