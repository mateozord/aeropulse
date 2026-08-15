function formatTime(date: Date) {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

type Props = {
  title: string;
  status: "idle" | "syncing" | "success" | "error";
  lastUpdated: Date | null;
  onRefresh: () => void;
};

export function SyncCard({ title, status, lastUpdated, onRefresh }: Props) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 transition-colors duration-300 hover:border-border-strong">
      <p className="text-xs uppercase tracking-wider text-muted">{title}</p>
      {status === "syncing" && !lastUpdated && (
        <p className="mt-2 text-lg font-medium text-accent">Sincronizando dados ao vivo…</p>
      )}
      {lastUpdated && (
        <p className="mt-2 text-3xl font-semibold tabular-nums text-foreground">{formatTime(lastUpdated)}</p>
      )}
      {status === "error" && !lastUpdated && (
        <p className="mt-2 text-sm font-medium text-elevated">Fonte de dados temporariamente indisponível</p>
      )}
      <button
        type="button"
        onClick={onRefresh}
        disabled={status === "syncing"}
        className="mt-3 text-xs uppercase tracking-wider text-muted transition-colors hover:text-accent disabled:opacity-50"
      >
        {status === "syncing" ? "Sincronizando…" : "Atualizar"}
      </button>
    </div>
  );
}
