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
          className="absolute h-3.5 w-3.5 animate-ping rounded-full opacity-40"
          style={{ backgroundColor: color }}
        />
      )}
      <span
        className="relative h-2.5 w-2.5 rounded-full transition-[transform,background-color,box-shadow] duration-300 group-hover:scale-125"
        style={{
          backgroundColor: color,
          boxShadow: active ? `0 0 0 4px ${color}33` : undefined,
        }}
      />
      <span className="pointer-events-none absolute top-7 whitespace-nowrap rounded bg-surface-raised px-1.5 py-0.5 text-[10px] font-medium text-muted opacity-0 shadow transition-opacity group-hover:opacity-100">
        {iata}
      </span>
    </button>
  );
}
