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
  const failed = status === "error";

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted">{title}</p>
        {status === "syncing" && !lastUpdated && (
          <p className="mt-1 text-sm font-medium text-accent">Sincronizando…</p>
        )}
        {lastUpdated && (
          <>
            <p className="mt-1 font-mono text-lg tabular-nums text-foreground">{formatTime(lastUpdated)}</p>
            {failed && (
              <p className="mt-0.5 text-[11px] text-elevated">Falha ao atualizar · mostrando último dado</p>
            )}
          </>
        )}
        {failed && !lastUpdated && (
          <p className="mt-1 text-sm font-medium text-elevated">Fonte de dados indisponível</p>
        )}
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={status === "syncing"}
        className="shrink-0 text-xs uppercase tracking-wider text-muted transition-colors hover:text-accent disabled:opacity-50"
      >
        {status === "syncing" ? "…" : "Atualizar"}
      </button>
    </div>
  );
}
