import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipContentProps } from "recharts";
import type { AeroPulseStatus } from "../../types/airport";
import type { TrendPoint } from "../../types/signal";
import { STATUS_COLOR } from "../../utils/status";

function ChartTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-border bg-surface-raised px-3 py-2 text-xs shadow-lg">
      <p className="text-muted">{label}</p>
      <p className="font-medium text-foreground">{payload[0].value}/100</p>
    </div>
  );
}

export function TrendChart({ timeline, status }: { timeline: TrendPoint[]; status: AeroPulseStatus }) {
  const color = STATUS_COLOR[status];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={timeline} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--color-muted)", fontSize: 11 }}
          axisLine={{ stroke: "var(--color-border)" }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "var(--color-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip content={ChartTooltip} cursor={{ stroke: "var(--color-border-strong)" }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill="url(#trendFill)"
          dot={{ r: 3, fill: color, strokeWidth: 0 }}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
