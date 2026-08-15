import type { AeroPulseStatus } from "../types/airport";
import { STATUS_LABEL_PT, STATUS_TEXT_CLASS } from "../utils/status";

export function StatusBadge({ status }: { status: AeroPulseStatus }) {
  return (
    <span
      className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${STATUS_TEXT_CLASS[status]}`}
    >
      {STATUS_LABEL_PT[status]}
    </span>
  );
}
