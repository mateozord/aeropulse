export function minutesSince(iso: string | undefined): number | null {
  if (!iso) return null;
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
}

export function isFresh(date: Date | null, maxMinutes: number): boolean {
  if (!date) return false;
  return (Date.now() - date.getTime()) / 60000 <= maxMinutes;
}

export function formatRelativeUpdate(iso: string | undefined): string {
  const mins = minutesSince(iso);
  if (mins === null) return "sem registro";
  if (mins < 1) return "agora mesmo";
  if (mins === 1) return "há 1 min";
  if (mins < 60) return `há ${mins} min`;
  const hours = Math.round(mins / 60);
  return hours === 1 ? "há 1h" : `há ${hours}h`;
}
