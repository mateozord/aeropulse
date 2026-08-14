import { useState } from "react";
import { fetchExplanation } from "../../services/explainSignal";
import type { ExplainPayload } from "../../types/explain";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; text: string }
  | { status: "error" };

export function ExplainSignal({ payload }: { payload: ExplainPayload }) {
  const [state, setState] = useState<State>({ status: "idle" });

  const explain = async () => {
    setState({ status: "loading" });
    try {
      const text = await fetchExplanation(payload);
      setState({ status: "ready", text });
    } catch {
      setState({ status: "error" });
    }
  };

  if (state.status === "idle") {
    return (
      <button
        type="button"
        onClick={explain}
        className="mt-4 text-sm text-accent transition-colors hover:text-foreground"
      >
        Explain this signal →
      </button>
    );
  }

  return (
    <div className="animate-fade-in-up mt-4 rounded-lg border border-border bg-surface-raised p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-muted">AI explanation</p>
        {state.status === "ready" && (
          <span className="text-[10px] uppercase tracking-wider text-muted">Gemini · experimental</span>
        )}
      </div>

      {state.status === "loading" && (
        <p className="mt-2 text-sm text-muted">Reading the signal…</p>
      )}
      {state.status === "ready" && <p className="mt-2 text-sm text-foreground">{state.text}</p>}
      {state.status === "error" && (
        <p className="mt-2 text-sm text-muted">
          AI explanation temporarily unavailable.{" "}
          <button type="button" onClick={explain} className="text-accent hover:underline">
            Try again
          </button>
        </p>
      )}
    </div>
  );
}
