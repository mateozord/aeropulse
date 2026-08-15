import { MockBadge } from "./MockBadge";

export function SourceTag({ source, label }: { source: "live" | "mock"; label: string }) {
  if (source === "mock") return <MockBadge />;

  return (
    <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-accent">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      Ao vivo · {label}
    </span>
  );
}
