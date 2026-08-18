import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-6xl font-semibold text-foreground">404</p>
      <p className="mt-3 text-xs uppercase tracking-[0.3em] text-attention">Sinal não encontrado</p>
      <p className="mt-4 text-sm text-muted">Essa rota não existe no AeroPulse.</p>
      <Link
        to="/"
        className="mt-8 rounded border border-border px-4 py-2 text-xs uppercase tracking-wider text-foreground transition-colors hover:border-border-strong hover:text-accent"
      >
        Voltar para a Visão Geral
      </Link>
    </section>
  );
}
