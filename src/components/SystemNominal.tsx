export function SystemNominal() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-normal" />
      <div>
        <p className="text-sm font-medium text-foreground">Sistema normal</p>
        <p className="text-xs text-muted">Nenhum sinal elevado detectado.</p>
      </div>
    </div>
  );
}
