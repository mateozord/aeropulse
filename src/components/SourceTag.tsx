import { MockBadge } from "./MockBadge";
import { formatRelativeUpdate } from "../utils/freshness";
import type { DataStatus } from "../utils/dataStatus";

type Props = DataStatus & { label: string };

/**
 * "Ao vivo" is only ever shown for a genuinely fresh live reading — a stale
 * or unavailable source says so explicitly instead of overclaiming.
 */
export function SourceTag({ source, label, stale, fetchedAt }: Props) {
  if (source === "mock") return <MockBadge />;

  if (source === "unavailable") {
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-muted" />
        Indisponível
      </span>
    );
  }

  if (stale) {
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-attention">
        <span className="h-1.5 w-1.5 rounded-full bg-attention" />
        {label} · atualizado {formatRelativeUpdate(fetchedAt)}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-accent">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      Ao vivo · {label}
    </span>
  );
}
