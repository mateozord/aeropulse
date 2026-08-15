import type { AeroPulseStatus } from "../../types/airport";
import { STATUS_COLOR, STATUS_LABEL_PT } from "../../utils/status";

type Props = {
  status: AeroPulseStatus;
  iata: string;
  active: boolean;
  onClick: () => void;
};

export function AirportMarker({ status, iata, active, onClick }: Props) {
  const color = STATUS_COLOR[status];
  const urgent = status === "ELEVATED" || status === "HIGH";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${iata} — ${STATUS_LABEL_PT[status]}`}
      className="group relative flex h-11 w-11 items-center justify-center"
    >
      {urgent && (
        <span
          className="animate-pulse-ring absolute h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      <span
        className={`relative h-2.5 w-2.5 rounded-full transition-[transform,box-shadow] duration-300 group-hover:scale-125 ${
          active ? "scale-125" : ""
        }`}
        style={{
          backgroundColor: color,
          boxShadow: active ? `0 0 0 3px var(--color-base), 0 0 0 5px ${color}` : undefined,
        }}
      />
      <span
        className={`pointer-events-none absolute top-7 whitespace-nowrap rounded border border-border-strong bg-surface-raised px-1.5 py-0.5 text-[10px] font-medium shadow transition-opacity ${
          active ? "text-foreground opacity-100" : "text-muted opacity-0 group-hover:opacity-100 group-hover:text-foreground"
        }`}
      >
        {iata}
      </span>
    </button>
  );
}
